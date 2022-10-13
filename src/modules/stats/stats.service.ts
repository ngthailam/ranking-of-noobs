import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { MatchUser } from '../match-user/entities/match-user';
import { ValidMove } from '../match/dto/make-move.dto';
import { MatchResult } from '../match/entities/match.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { Stats } from './entities/stats.entity';

@Injectable()
export class StatsService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Stats)
    private readonly statsRepo: Repository<Stats>,
  ) {}

  findOneById(id: string) {
    return this.getCreateIfNotExist(id);
  }

  async updateStatsOnMatchResult(
    primaryUser: User,
    secondaryUser: User,
    matchResult: MatchResult,
    matchUsers: MatchUser[],
  ) {
    const primaryUserStats = await this.getCreateIfNotExist(primaryUser.id);
    const secondaryUserStats = await this.getCreateIfNotExist(secondaryUser.id);

    // Update win, lose, draw count
    switch (matchResult) {
      case MatchResult.WIN:
        primaryUserStats.winCount = primaryUserStats.winCount + 1;
        secondaryUserStats.loseCount = secondaryUserStats.loseCount + 1;
        break;
      case MatchResult.DRAW:
        primaryUserStats.drawCount = primaryUserStats.drawCount + 1;
        secondaryUserStats.drawCount = secondaryUserStats.drawCount + 1;
        break;
      case MatchResult.LOSE:
        primaryUserStats.loseCount = primaryUserStats.loseCount + 1;
        secondaryUserStats.winCount = secondaryUserStats.winCount + 1;
        break;
    }

    // Update elo highest/lowest
    if (primaryUser.elo > primaryUserStats.highestElo) {
      primaryUserStats.highestElo = primaryUser.elo;
    }
    if (primaryUser.elo < primaryUserStats.lowestElo) {
      primaryUserStats.lowestElo = primaryUser.elo;
    }

    if (secondaryUser.elo > secondaryUserStats.highestElo) {
      secondaryUserStats.highestElo = secondaryUser.elo;
    }
    if (secondaryUser.elo < secondaryUserStats.lowestElo) {
      secondaryUserStats.lowestElo = secondaryUser.elo;
    }

    // Update paper - rock - scissors count
    // TODO: refactor this
    matchUsers.forEach((element) => {
      if (element.userId == primaryUser.id) {
        switch (element.move) {
          case ValidMove.ROCK:
            primaryUserStats.rockCount = primaryUserStats.rockCount + 1;
            break;
          case ValidMove.PAPER:
            primaryUserStats.paperCount = primaryUserStats.paperCount + 1;
            break;
          case ValidMove.SCISSORS:
            primaryUserStats.scissorsCount = primaryUserStats.scissorsCount + 1;
            break;
        }
      } else {
        switch (element.move) {
          case ValidMove.ROCK:
            secondaryUserStats.rockCount = secondaryUserStats.rockCount + 1;
            break;
          case ValidMove.PAPER:
            secondaryUserStats.paperCount = secondaryUserStats.paperCount + 1;
            break;
          case ValidMove.SCISSORS:
            secondaryUserStats.scissorsCount =
              secondaryUserStats.scissorsCount + 1;
            break;
        }
      }
    });

    console.log(`prim = ${primaryUser.id} - ${secondaryUser.id}`);
    console.log(
      `Updating stats on match result prime ${JSON.stringify(
        primaryUserStats,
      )}`,
    );

    console.log(
      `Updating stats on match result second ${JSON.stringify(
        secondaryUserStats,
      )}`,
    );

    // Save all the data
    await Promise.all([
      this.statsRepo.save(primaryUserStats),
      this.statsRepo.save(secondaryUserStats),
    ]);
  }

  async getCreateIfNotExist(userId: string) {
    let userStats = await this.statsRepo.findOne({
      where: { id: userId },
    });

    if (!userStats) {
      const stats = new Stats();
      stats.id = userId;
      userStats = await this.statsRepo.save(stats);
    }

    return userStats;
  }

  getLeaderboard() {
    return this.userService.getSortByElo();
  }
}
