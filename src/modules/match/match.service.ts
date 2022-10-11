import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatchUser } from '../match-user/entities/match-user';
import { MatchUserService } from '../match-user/match-user.service';
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
  ) {}

  async createMatch(createMatchDto: CreateMatchDto) {
    console.log('Creating a new match');
    const primaryUser = await this.userService.findOne(createMatchDto.userId);
    const existinMatch = await this.matchUserService.findOneByUserId(
      primaryUser.id,
    );
    if (existinMatch != null) {
      throw new HttpException(
        `User with id=${primaryUser.id} is already in a match`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Create a new match here
    const match = new Match();
    const createdMatch = await this.matchRepo.save(match);

    // Find a random opponent
    const secondaryUser = new User();
    secondaryUser.id = createMatchDto.opponentId;

    // Create match-user
    const matchUserPrimary = new MatchUser();
    matchUserPrimary.userId = primaryUser.id;
    matchUserPrimary.matchId = createdMatch.id;

    const matchUserSecondary = new MatchUser();
    matchUserSecondary.userId = secondaryUser.id;
    matchUserSecondary.matchId = createdMatch.id;

    this.matchUserService.create(matchUserPrimary);
    this.matchUserService.create(matchUserSecondary);

    return createdMatch;
  }

  async setResult(matchResultDto: MatchResultDto) {
    const matchUser: MatchUser[] = await this.matchUserService.findAllByMatchId(
      matchResultDto.matchId,
    );

    let primaryUserId: string;
    let secondaryUserId: string;

    const primaryUserIndex = matchUser.findIndex((element) => {
      element.userId == matchResultDto.primaryUserId;
    });

    matchUser.forEach((element) => {
      if (element.userId == matchResultDto.primaryUserId) {
        primaryUserId = element.id;
      } else {
        secondaryUserId == element.id;
      }
    });

    const primaryUser = await this.userService.findOne(
      matchResultDto.primaryUserId,
    );
    const secondaryUser = await this.userService.findOne(
      (matchUser[1] as MatchUser).userId,
    );

    // Resolves ELO where
    const resolvedMatchResult = MatchResult[matchResultDto.result];
    const elo: number = EloCalculator.calculate(
      primaryUser.elo,
      secondaryUser.elo,
      resolvedMatchResult,
    );

    this.userService.updateElo(primaryUser, elo);
    this.userService.updateElo(secondaryUser, -elo);

    // TODO: Set to match history

    // Delete match in temp
    this.matchRepo.delete({ id: matchResultDto.matchId });
    this.matchUserService.deleteAllByMatchId(matchResultDto.matchId);
  }

  findAll() {
    return this.matchRepo.find();
  }
}
