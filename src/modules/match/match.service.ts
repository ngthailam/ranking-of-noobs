import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMatchHistoryDto } from '../match-history/dto/create-match-history.dto';
import { MatchHistoryService } from '../match-history/match-history.service';
import { UserService } from '../user/user.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { MakeMoveDto } from './dto/make-move.dto';
import { MatchResultDto } from './dto/match-result.dto';
import { EloCalculator } from './utils/elo-calculator';
import { Match, MatchResult, MATCH_TBL_KEYS } from './entities/match.entity';
import { MatchResultCalculator } from './utils/win-lose-calculator';
import { UpdateUserResultDto } from '../user/dto/update-user-result.dto';
import { StatsService } from '../stats/stats.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  EVENTS_KEY,
  MakeMoveEvent,
  MatchInitiatedEvent,
  MatchResultEvent,
} from 'src/core/const/events';
import { CONSTS } from 'src/core/const/constants';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,
    private readonly userService: UserService,
    private readonly matchHistoryService: MatchHistoryService,
    private readonly statsService: StatsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private readonly logger = new Logger(MatchService.name);

  async findOne(id: string) {
    const match = await this.matchRepo.findOne({
      where: { id: id },
    });
    if (!match) {
      throw new HttpException(
        `Match with id = ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return match;
  }

  async createMatch(createMatchDto: CreateMatchDto) {
    // Find open room with elo range
    const user = await this.userService.findOne(createMatchDto.userId);
    let match = await this.matchRepo
      .createQueryBuilder(MATCH_TBL_KEYS.tblName)
      .where(
        `${MATCH_TBL_KEYS.tblName}.${MATCH_TBL_KEYS.primaryUserId} != '${createMatchDto.userId}'`,
      )
      .andWhere(
        `${MATCH_TBL_KEYS.tblName}.${MATCH_TBL_KEYS.secondaryUserId} is null`,
      )
      .andWhere(
        `${MATCH_TBL_KEYS.tblName}.${MATCH_TBL_KEYS.primaryUserElo} > ${
          user.elo - CONSTS.findOpponentEloRange
        } `,
      )
      .andWhere(
        `${MATCH_TBL_KEYS.tblName}.${MATCH_TBL_KEYS.primaryUserElo} <= ${
          user.elo + CONSTS.findOpponentEloRange
        } `,
      )
      .orderBy('RANDOM()')
      .limit(1)
      .getOne();

    this.logger.log(
      `[createMatch], dto=${JSON.stringify(
        createMatchDto,
      )}, found match with id=${match?.id}`,
    );

    if (!match) {
      // create new match if no match able to satisfy conditions
      match = new Match();
      match.primaryUserId = user.id;
      match.primaryUserElo = user.elo;
      match = await this.matchRepo.save(match);
      this.logger.log(
        `[createMatch], cannot find match, creating a new match, match=${JSON.stringify(
          match,
        )}`,
      );
    } else {
      // join the match
      match.secondaryUserId = user.id;
      match.secondaryUserElo = user.elo;
      match = await this.matchRepo.save(match);
      this.eventEmitter.emit(
        EVENTS_KEY.matchInitiated,
        new MatchInitiatedEvent(match.id),
      );
      this.logger.log(
        `[createMatch], joining match as secondary user, match=${JSON.stringify(
          match,
        )}`,
      );
    }

    return match;
  }

  async makeMove(makeMoveDto: MakeMoveDto) {
    const match = await this.findOne(makeMoveDto.matchId);
    const isPrimary = makeMoveDto.userId == match.primaryUserId;

    // TODO: maybe add check if user not exist in findAllByMatchId or here
    const hasPrimaryUserMadeMove = isPrimary && match.primaryUserMove;
    const hasSecondaryUserMadeMove = !isPrimary && match.secondaryUserMove;
    
    console.log(` ZZLL ${match.primaryUserId} - ${match.secondaryUserId}`)
    if (hasPrimaryUserMadeMove || hasSecondaryUserMadeMove) {
      throw new HttpException('Already made a move', HttpStatus.NOT_FOUND);
    }

    if (!match.primaryUserId || !match.secondaryUserId) {
      throw new HttpException(
        'Cannot make a move before you have an opponent',
        HttpStatus.NOT_FOUND,
      );
    }

    // Saving user move
    if (isPrimary) {
      match.primaryUserMove = makeMoveDto.move;
    } else {
      match.secondaryUserMove = makeMoveDto.move;
    }
    await this.matchRepo.save(match);

    // Emit made move event
    this.eventEmitter.emit(
      EVENTS_KEY.makeMove,
      new MakeMoveEvent(
        makeMoveDto.matchId,
        makeMoveDto.userId,
        makeMoveDto.move,
      ),
    );

    // Returning the match result
    let matchResultDto = new MatchResultDto();
    matchResultDto.match = match;

    // If theres still 1 user who hasnt made a move, just return the object
    if (!match.primaryUserMove || !match.secondaryUserMove) {
      return match;
    }

    // If both user has made a move, set the result for the match
    matchResultDto.result =
      MatchResult[
        MatchResultCalculator.calculate(
          match.primaryUserMove,
          match.secondaryUserMove,
        )
      ];

    this.setResult(matchResultDto);

    return matchResultDto;
  }

  async setSeenResult(userId: string, matchId: string) {
    const match = await this.findOne(matchId);
    const isPrimary = match.primaryUserId == userId;

    match.isPrimaryUserSeenResult = isPrimary
      ? true
      : match.isPrimaryUserSeenResult;
    match.isSecondaryUserSeenResult = !isPrimary
      ? true
      : match.isSecondaryUserSeenResult;

    // If both has seen result, delete the match
    if (
      (isPrimary && match.isSecondaryUserSeenResult) ||
      (!isPrimary && match.isPrimaryUserSeenResult)
    ) {
      await this.matchRepo.delete({ id: matchId });
      return match;
    }

    return this.matchRepo.save(match);
  }

  private async setResult(matchResultDto: MatchResultDto) {
    const matchResult: MatchResult = MatchResult[matchResultDto.result];

    const match = matchResultDto.match;
    const users = await Promise.all([
      this.userService.findOne(match.primaryUserId),
      this.userService.findOne(match.secondaryUserId),
    ]);

    const primaryUser = users[0];
    const secondaryUser = users[1];

    // Resolves ELO
    let elo: number = EloCalculator.calculate(
      primaryUser.elo,
      secondaryUser.elo,
      matchResult,
    );

    let primaryUserEloAfter = primaryUser.elo + elo;
    let secondaryUserEloAfter = secondaryUser.elo + elo;

    switch (matchResult) {
      case MatchResult.DRAW:
        primaryUserEloAfter =
          primaryUser.elo + (primaryUser.elo > secondaryUser.elo ? elo : -elo);
        secondaryUserEloAfter =
          secondaryUser.elo +
          (secondaryUser.elo > primaryUser.elo ? elo : -elo);
        break;
      case MatchResult.WIN:
        primaryUserEloAfter = primaryUser.elo + elo;
        secondaryUserEloAfter = secondaryUser.elo - elo;
        break;
      case MatchResult.LOSE:
        primaryUserEloAfter = primaryUser.elo - elo;
        secondaryUserEloAfter = secondaryUser.elo + elo;
        break;
    }

    // Set match history
    this.matchHistoryService.create(
      CreateMatchHistoryDto.from(
        match,
        primaryUser.elo,
        primaryUserEloAfter,
        secondaryUser.elo,
        secondaryUserEloAfter,
      ),
    );

    // Update match count + elo
    primaryUser.matchCount = primaryUser.matchCount + 1;
    primaryUser.elo = primaryUserEloAfter;
    secondaryUser.matchCount = secondaryUser.matchCount + 1;
    secondaryUser.elo = secondaryUserEloAfter;

    // Update stats
    await this.statsService.updateStatsOnMatchResult(
      primaryUser,
      secondaryUser,
      match,
      matchResult,
    );

    await Promise.all([
      this.userService.updateOnMatchResult(
        primaryUser.id,
        new UpdateUserResultDto(primaryUser.matchCount, primaryUser.elo),
      ),
      this.userService.updateOnMatchResult(
        secondaryUser.id,
        new UpdateUserResultDto(secondaryUser.matchCount, secondaryUser.elo),
      ),
    ]);

    this.eventEmitter.emit(
      EVENTS_KEY.matchResult,
      new MatchResultEvent(
        match.id,
        match.primaryUserId,
        match.primaryUserMove,
        match.secondaryUserId,
        match.secondaryUserMove,
        matchResult,
      ),
    );
  }

  findAll() {
    return this.matchRepo.find();
  }

  findAllByUserId(uid: string) {
    return this.matchRepo
      .createQueryBuilder(`${MATCH_TBL_KEYS.tblName}`)
      .where(
        `${MATCH_TBL_KEYS.tblName}.${MATCH_TBL_KEYS.primaryUserId} = '${uid}'`,
      )
      .orWhere(
        `${MATCH_TBL_KEYS.tblName}.${MATCH_TBL_KEYS.secondaryUserId} = '${uid}'`,
      )
      .orderBy(`${MATCH_TBL_KEYS.tblName}.${MATCH_TBL_KEYS.createdAt}`, 'ASC') // TODO: check this
      .getMany();
  }
}
