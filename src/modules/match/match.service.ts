import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMatchHistoryDto } from '../match-history/dto/create-match-history.dto';
import { MatchHistoryService } from '../match-history/match-history.service';
import { UserService } from '../user/user.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { MakeMoveDto } from './dto/make-move.dto';
import { MatchResultDto } from './dto/match-result.dto';
import { EloCalculator } from './utils/elo-calculator';
import { Match, MatchResult } from './entities/match.entity';
import { MatchResultCalculator } from './utils/win-lose-calculator';
import { UpdateUserResultDto } from '../user/dto/update-user-result.dto';
import { StatsService } from '../stats/stats.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  EVENTS_KEY,
  MakeMoveEvent,
  MatchResultEvent,
} from 'src/core/const/events';

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
    // Find a random opponent if an opponent is not specified
    const primaryUser = await this.userService.findOne(createMatchDto.userId);
    const secondaryUser =
      createMatchDto.opponentId && createMatchDto.opponentId.length !== 0
        ? await this.userService.findOne(createMatchDto.opponentId)
        : await this.userService.forceFindOneWithinEloRange(
            primaryUser.id,
            primaryUser.elo,
          );

    if (!secondaryUser || !secondaryUser.id) {
      throw new HttpException(
        `Cannot find an opponent for ${JSON.stringify(
          secondaryUser,
        )} ${JSON.stringify(primaryUser)}`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Create a new match here
    const match = new Match();
    match.primaryUserId = primaryUser.id;
    match.secondaryUserId = secondaryUser.id;
    const createdMatch = await this.matchRepo.save(match);

    // console.log(
    //   `[MatchService] createMatch: match=${JSON.stringify(createdMatch)}`,
    // );

    return createdMatch;
  }

  async makeMove(makeMoveDto: MakeMoveDto) {
    // TODO: needs to refactor this, to ugly
    const match = await this.findOne(makeMoveDto.matchId);
    const isPrimary = makeMoveDto.userId == match.primaryUserId;

    // TODO: maybe add check if user not exist in findAllByMatchId or here
    const hasPrimaryUserMadeMove = isPrimary && match.primaryUserMove;
    const hasSecondaryUserMadeMove = !isPrimary && match.secondaryUserMove;
    if (hasPrimaryUserMadeMove || hasSecondaryUserMadeMove) {
      throw new HttpException('Already made a move', HttpStatus.NOT_FOUND);
    }

    // TODO: makeMove
    if (isPrimary) {
      match.primaryUserMove = makeMoveDto.move;
    } else {
      match.secondaryUserMove = makeMoveDto.move;
    }

    // TODO: check this, this is to save the user move
    await this.matchRepo.save(match);

    this.eventEmitter.emit(
      EVENTS_KEY.makeMove,
      new MakeMoveEvent(
        makeMoveDto.matchId,
        makeMoveDto.userId,
        makeMoveDto.move,
      ),
    );

    if (!match.primaryUserMove || !match.secondaryUserMove) {
      return 'You made your move';
    }

    // Set result for the game if both users have made a move
    const matchResultDto = new MatchResultDto();
    matchResultDto.match = match;
    matchResultDto.result =
      MatchResult[
        MatchResultCalculator.calculate(
          match.primaryUserMove,
          match.secondaryUserMove,
        )
      ];

    return this.setResult(matchResultDto);
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

    // console.log(
    //   `=====> after matchusers ${primaryUserId} - ${secondaryUserId} - ${users.length} ${primaryUser.id} - ${secondaryUser.id}`,
    // );

    // Resolves ELO
    let elo: number = EloCalculator.calculate(
      primaryUser.elo,
      secondaryUser.elo,
      matchResult,
    );

    // Set match history
    this.matchHistoryService.create(CreateMatchHistoryDto.from(match));

    // Update match count + elo
    primaryUser.matchCount = primaryUser.matchCount + 1;
    primaryUser.elo = primaryUser.elo + elo;
    secondaryUser.matchCount = secondaryUser.matchCount + 1;
    secondaryUser.elo = secondaryUser.elo - elo;

    // Update stats
    await this.statsService.updateStatsOnMatchResult(
      primaryUser,
      secondaryUser,
      match,
      matchResult,
    );

    await Promise.all([
      this.userService.updateResult(
        primaryUser.id,
        new UpdateUserResultDto(primaryUser.matchCount, primaryUser.elo),
      ),
      this.userService.updateResult(
        secondaryUser.id,
        new UpdateUserResultDto(secondaryUser.matchCount, secondaryUser.elo),
      ),

      this.matchRepo.delete({ id: match.id }),
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
    return this.matchRepo.find({ where: {} });
  }
}
