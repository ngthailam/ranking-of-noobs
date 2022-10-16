import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { AchievementStore, ACHIEVEMENT_KEY } from './achievement-store';
import { Achievement } from './entities/achievement.entity';
import {
  AchievementsUsers,
  ACHI_USER_TBL_KEYS,
} from './entities/achievements-users.entity';
import { AchievementByUserResponse } from './response/achievement-by-user.response';
import { OnEvent } from '@nestjs/event-emitter';
import {
  EVENTS_KEY,
  MakeMoveEvent,
  MatchResultEvent,
} from 'src/core/const/events';
import { ValidMove } from '../match/dto/make-move.dto';
import { MatchResult } from '../match/entities/match.entity';
import { UserService } from '../user/user.service';
import { StatsService } from '../stats/stats.service';

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achiRepo: Repository<Achievement>,
    @InjectRepository(AchievementsUsers)
    private readonly achiUserRepo: Repository<AchievementsUsers>,
    private readonly userService: UserService,
    private readonly statsService: StatsService,
  ) {}

  private readonly logger = new Logger(AchievementService.name);

  findAll() {
    return this.achiRepo.find();
  }

  async findAllByUserId(id: string, isDone: boolean = false) {
    this.logger.debug(`[findAllByUserId] id=${id}, isDone=${isDone}`);
    const achievements = await this.findAll();

    const achievementsByUser = await this.achiUserRepo.find({
      where: { userId: id },
    });

    return achievements
      .map((element) => {
        const response = new AchievementByUserResponse();
        response.achievement = element;
        const achivementUser = achievementsByUser.find(
          (achieveUser) => achieveUser.achievementId == element.id,
        );
        response.isDone = achivementUser?.isDone ?? false;
        response.progress =
          achivementUser?.progress || ACHI_USER_TBL_KEYS.defaultProgress;
        return response;
      })
      .filter((element) => element.isDone == isDone);
  }

  async updateProgress(achievementId: string, userId: string) {
    const achievement = await this.achievementFindOne(achievementId);
    const achievementUser = await this.achievementUserFindOneCreateIfNotExist(
      achievementId,
      userId,
    );
    if (achievementUser.isDone) {
      this.logger.warn(
        `[updateProgress] Achievement is already done, id=${achievementId}, userId=${userId}`,
      );
      return;
    }
    let newProgress = achievementUser.progress + 1;
    if (newProgress >= achievement.max) {
      newProgress = achievement.max;
      achievementUser.isDone = true;
    }
    achievementUser.progress = newProgress;
    await this.achiUserRepo.save(achievementUser);
  }

  async achievementUserFindOneCreateIfNotExist(
    achievementId: string,
    userId: string,
  ) {
    let achievementUser = await this.achiUserRepo.findOne({
      where: {
        userId: userId,
        achievementId: achievementId,
      },
    });
    if (!achievementUser) {
      achievementUser = new AchievementsUsers();
      achievementUser.achievementId = achievementId;
      achievementUser.userId = userId;
      return this.achiUserRepo.save(achievementUser);
    }

    return achievementUser;
  }

  async achievementFindOne(achievementId: string) {
    const achievement = await this.achiRepo.findOne({
      where: { id: achievementId },
    });
    if (!achievement) {
      throw new HttpException(
        `Achievement not found, id=${achievementId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return achievement;
  }

  populateAchievements() {
    return this.achiRepo.save(AchievementStore.getAchievements());
  }

  @OnEvent(EVENTS_KEY.matchResult, { async: true })
  async handleMatchResultEvent(payload: MatchResultEvent) {
    // TODO: consider updating logic to improve performance
    const winnerUserId =
      payload.result == MatchResult.WIN
        ? payload.primaryUserId
        : payload.secondaryUserId;

    const loserUserId =
      payload.result == MatchResult.LOSE
        ? payload.primaryUserId
        : payload.secondaryUserId;

    const winnerStat = await this.statsService.findOneById(winnerUserId);
    const loserStat = await this.statsService.findOneById(loserUserId);

    if (winnerStat.getMatchCount() == 1) {
      await this.updateProgress(ACHIEVEMENT_KEY.GAMES_1, winnerUserId);
      await this.updateProgress(ACHIEVEMENT_KEY.WINER_1, loserUserId);
      return;
    }
    if (loserStat.getMatchCount() == 1) {
      // Improve performance here
      await this.updateProgress(ACHIEVEMENT_KEY.GAMES_1, loserUserId);
      await this.updateProgress(ACHIEVEMENT_KEY.LOSER_1, loserUserId);
      return;
    }

    if (winnerStat.getMatchCount() <= 10) {
      await this.updateProgress(ACHIEVEMENT_KEY.GAMES_10, winnerUserId);
      return;
    }
    if (loserStat.getMatchCount() <= 10) {
      await this.updateProgress(ACHIEVEMENT_KEY.GAMES_10, loserUserId);
      return;
    }
  }

  @OnEvent(EVENTS_KEY.makeMove, { async: true })
  async handleMakeMoveEvent(payload: MakeMoveEvent) {
    this.logger.debug(
      `[handleMakeMoveEvent] Handle event=${
        EVENTS_KEY.makeMove
      }, payload=${JSON.stringify(payload)}`,
    );
    // TODO: improve this in the future, not always need to update all of these
    // TODO: FILL ACHIEVEMENTS_USERS on create user instead
    let achievementId: string;
    switch (payload.move) {
      case ValidMove.ROCK:
        achievementId = ACHIEVEMENT_KEY.ROCK_USER;
        break;
      case ValidMove.PAPER:
        achievementId = ACHIEVEMENT_KEY.PAPER_USER;
        break;
      case ValidMove.SCISSORS:
        achievementId = ACHIEVEMENT_KEY.SCISSORS_USER;
        break;
    }
    const achivementUser = await this.achievementUserFindOneCreateIfNotExist(
      ACHIEVEMENT_KEY.SCISSORS_USER,
      payload.userId,
    );

    this.logger.debug(
      `[handleMakeMoveEvent] Current achievement user=${JSON.stringify(
        achivementUser,
      )}`,
    );

    if (!achivementUser) {
      this.logger.error(
        `[handleMakeMoveEvent] Achievement not found for user=${
          payload.userId
        }, payload=${JSON.stringify(payload)}`,
      );
      return;
    }

    if (!achivementUser.isDone) {
      achivementUser.progress += 1;
      achivementUser.isDone = true;
      await this.updateProgress(achievementId, payload.userId);
    }
  }
}
