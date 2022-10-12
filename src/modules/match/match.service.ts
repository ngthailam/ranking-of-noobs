import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMatchHistoryDto } from '../match-history/dto/create-match-history.dto';
import { MatchHistoryService } from '../match-history/match-history.service';
import { MatchUser } from '../match-user/entities/match-user';
import { MatchUserService } from '../match-user/match-user.service';
import { UserService } from '../user/user.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { MakeMoveDto } from './dto/make-move.dto';
import { MatchResultDto } from './dto/match-result.dto';
import { EloCalculator } from './utils/elo-calculator';
import { Match, MatchResult } from './entities/match.entity';
import { MatchResultCalculator } from './utils/win-lose-calculator';
import { UpdateUserResultDto } from '../user/dto/update-user-result.dto';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,
    private readonly userService: UserService,
    private readonly matchUserService: MatchUserService,
    private readonly matchHistoryService: MatchHistoryService,
  ) {}

  findOne(id: string) {
    return this.matchRepo.findOne({ where: { id: id } });
  }

  async createMatch(createMatchDto: CreateMatchDto) {
    const existinMatch = await this.matchUserService.findOneByUserId(
      createMatchDto.userId,
    );

    if (existinMatch != null) {
      throw new HttpException(
        `User with id=${createMatchDto.userId} is already in a match`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Find a random opponent if an opponent is not specified
    const primaryUser = await this.userService.findOne(createMatchDto.userId);
    const secondaryUser = await this.userService.forceFindOneWithinEloRange(
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

    // Create match-user
    // Create a new match here
    const match = new Match();
    const createdMatch = await this.matchRepo.save(match);

    const matchUserPrimary = new MatchUser(createdMatch.id, primaryUser.id);
    const matchUserSecondary = new MatchUser(createdMatch.id, secondaryUser.id);

    await Promise.all([
      this.matchUserService.create(matchUserPrimary),
      this.matchUserService.create(matchUserSecondary),
    ]);

    // console.log(
    //   `[MatchService] match_user: ${createdMatch.id} ${matchUserPrimary.userId} - ${matchUserSecondary.userId}`,
    // );

    return createdMatch;
  }

  async makeMove(makeMoveDto: MakeMoveDto) {
    // TODO: needs to refactor this, to ugly
    const matchUser = await this.matchUserService.findAllByMatchId(
      makeMoveDto.matchId,
    );

    let primaryMatchUser: MatchUser;
    let secondaryMatchUser: MatchUser;

    matchUser.forEach((element) => {
      if (element.userId == makeMoveDto.userId) {
        primaryMatchUser = element;
      } else {
        secondaryMatchUser = element;
      }
    });

    // TODO: maybe add check if user not exist in findAllByMatchId or here
    if (primaryMatchUser.move) {
      MatchResultCalculator.calculate(
        makeMoveDto.move,
        secondaryMatchUser.move,
      );
      throw new HttpException('Already made a move', HttpStatus.NOT_FOUND);
    }

    await this.matchUserService.makeMove(
      makeMoveDto.userId,
      makeMoveDto.matchId,
      makeMoveDto.move,
    );

    // If the other user has not made a move
    if (!secondaryMatchUser.move) {
      return 'DONE, WAITING FOR OTHER PLAYER';
    }

    // set result for the game
    const matchResultDto = new MatchResultDto();
    matchResultDto.matchId = makeMoveDto.matchId;
    matchResultDto.primaryUserId = makeMoveDto.userId;
    matchResultDto.result =
      MatchResult[
        MatchResultCalculator.calculate(
          makeMoveDto.move,
          secondaryMatchUser.move,
        )
      ];

    return this.setResult(matchResultDto);
  }

  async setResult(matchResultDto: MatchResultDto) {
    const matchUser = await this.matchUserService.findAllByMatchId(
      matchResultDto.matchId,
    );

    // TODO: needs to refactor this, to ugly
    let primaryUserId: string;
    let secondaryUserId: string;

    matchUser.forEach((element) => {
      if (element.userId == matchResultDto.primaryUserId) {
        primaryUserId = element.userId;
      } else {
        secondaryUserId == element.userId;
      }
    });

    const users = await Promise.all([
      this.userService.findOne(primaryUserId),
      this.userService.findOne(secondaryUserId),
    ]);

    const primaryUser = users[0];
    const secondaryUser = users[1];

    // Resolves ELO where
    const resolvedMatchResult = MatchResult[matchResultDto.result];
    let elo: number = EloCalculator.calculate(
      primaryUser.elo,
      secondaryUser.elo,
      resolvedMatchResult,
    );

    // To prevent elo going down below 0
    if (elo > secondaryUser.elo) {
      elo = secondaryUser.elo;
    }

    // Set match history
    const match = await this.findOne(matchResultDto.matchId);
    this.matchHistoryService.create(CreateMatchHistoryDto.from(match));

    // Update match count
    primaryUser.matchCount = primaryUser.matchCount + 1;
    primaryUser.elo = primaryUser.elo + elo;
    secondaryUser.matchCount = secondaryUser.matchCount + 1;
    secondaryUser.elo = secondaryUser.elo - elo;

    await Promise.all([
      // Update elo
      this.userService.updateResult(
        primaryUser.id,
        new UpdateUserResultDto(primaryUser.matchCount, primaryUser.elo),
      ),
      this.userService.updateResult(
        secondaryUser.id,
        new UpdateUserResultDto(secondaryUser.matchCount, secondaryUser.elo),
      ),

      // Delete match in temp
      this.matchRepo.delete({ id: matchResultDto.matchId }),
      this.matchUserService.deleteAllByMatchId(matchResultDto.matchId),
    ]);
  }


  findAll() {
    return this.matchRepo.find();
  }
}
