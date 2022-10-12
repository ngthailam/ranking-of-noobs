import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMatchHistoryDto } from '../match-history/dto/create-match-history.dto';
import { MatchHistoryService } from '../match-history/match-history.service';
import { MatchUser } from '../match-user/entities/match-user';
import { MatchUserService } from '../match-user/match-user.service';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { MatchResultDto } from './dto/match-result.dto';
import { EloCalculator } from './elo-calculator/elo-calculator';
import { Match, MatchResult } from './entities/match.entity';

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
    const secondaryUser = await this.userService.forceFindOneWithinRange(
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

    // console.log(
    //   `[MatchService] setResult: incrementMatchCount for - ${primaryUser.id} - ${secondaryUser.id}`,
    // );

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
    this.updateMatchHistory(matchResultDto.matchId);

    await Promise.all([
      // Update elo
      this.userService.updateElo(primaryUser, elo),
      this.userService.updateElo(secondaryUser, -elo),
      // Update match count
      this.userService.incrementMatchCount(primaryUser.id),
      this.userService.incrementMatchCount(secondaryUser.id),
      // Delete match in temp
      this.matchRepo.delete({ id: matchResultDto.matchId }),
      this.matchUserService.deleteAllByMatchId(matchResultDto.matchId),
    ]);
  }

  private async updateMatchHistory(matchId: string) {
    const match = await this.findOne(matchId);
    this.matchHistoryService.create(CreateMatchHistoryDto.from(match));
  }

  findAll() {
    return this.matchRepo.find();
  }
}
