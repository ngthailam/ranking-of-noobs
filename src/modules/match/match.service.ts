import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMatchHistoryDto } from '../match-history/dto/create-match-history.dto';
import { MatchHistoryService } from '../match-history/match-history.service';
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
    private readonly matchHistoryService: MatchHistoryService,
  ) {}

  findOne(id: string) {
    return this.matchRepo.findOne({ where: { id: id } });
  }

  async createMatch(createMatchDto: CreateMatchDto) {
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

    // Find a random opponent if an opponent is not specified
    let secondaryUser = new User();
    if (createMatchDto.opponentId) {
      secondaryUser.id = createMatchDto.opponentId;
    } else {
      secondaryUser = await this.userService.findRandom(primaryUser.id);
    }

    // Create match-user
    const matchUserPrimary = new MatchUser(createdMatch.id, primaryUser.id);
    const matchUserSecondary = new MatchUser(
      createdMatch.id,
      matchUserPrimary.id,
    );

    this.matchUserService.create(matchUserPrimary);
    this.matchUserService.create(matchUserSecondary);

    return createdMatch;
  }

  async setResult(matchResultDto: MatchResultDto) {
    const matchUser: MatchUser[] = await this.matchUserService.findAllByMatchId(
      matchResultDto.matchId,
    );
    // TODO: needs to refactor this, to ugly
    let primaryUserId: string;
    let secondaryUserId: string;

    matchUser.forEach((element) => {
      if (element.userId == matchResultDto.primaryUserId) {
        primaryUserId = element.id;
      } else {
        secondaryUserId == element.id;
      }
    });

    const primaryUser = await this.userService.findOne(primaryUserId);
    const secondaryUser = await this.userService.findOne(secondaryUserId);

    // Resolves ELO where
    const resolvedMatchResult = MatchResult[matchResultDto.result];
    const elo: number = EloCalculator.calculate(
      primaryUser.elo,
      secondaryUser.elo,
      resolvedMatchResult,
    );

    this.userService.updateElo(primaryUser, elo);
    this.userService.updateElo(secondaryUser, -elo);

    // Set match history
    const match = await this.findOne(matchResultDto.matchId);
    this.matchHistoryService.create(CreateMatchHistoryDto.from(match));

    // Delete match in temp
    this.matchRepo.delete({ id: matchResultDto.matchId });
    this.matchUserService.deleteAllByMatchId(matchResultDto.matchId);
  }

  findAll() {
    return this.matchRepo.find();
  }
}
