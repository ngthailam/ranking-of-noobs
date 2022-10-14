import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { AchievementStore } from './achievement-store';
import { Achievement, ACHI_TBL_KEYS } from './entities/achievement.entity';
import {
  AchievementsUsers,
  ACHI_USER_TBL_KEYS,
} from './entities/achievements-users.entity';
import { AchievementByUserResponse } from './response/achievement-by-user.response';

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement)
    private readonly achiRepo: Repository<Achievement>,
    @InjectRepository(AchievementsUsers)
    private readonly achiUserRepo: Repository<AchievementsUsers>,
  ) {}

  findAll() {
    return this.achiRepo.find();
  }

  async findAllByUserId(id: string) {
    const achievements = await this.findAll();

    const achievementsByUser = await this.achiUserRepo.find({
      where: { userId: id },
    });

    // TODO: put into object or smt
    return achievements.map((element) => {
      const response = new AchievementByUserResponse();
      response.achievement = element;
      const achivementUser = achievementsByUser.find(
        (achieveUser) => (achieveUser.achievementId = element.id),
      );
      response.isDone = achivementUser?.isDone ?? false;
      response.progress =
        achivementUser?.progress || ACHI_USER_TBL_KEYS.defaultProgress;
      return response;
    });

    // return this.achiRepo.query(
    //   `
    //     SELECT * FROM ${ACHI_TBL_KEYS.tblName}
    //     LEFT JOIN ${ACHI_USER_TBL_KEYS.tblName}
    //     ON ${ACHI_TBL_KEYS.tblName}.${ACHI_TBL_KEYS.id}=${ACHI_USER_TBL_KEYS.tblName}.${ACHI_USER_TBL_KEYS.achievementId}
    //     WHERE ${ACHI_USER_TBL_KEYS.userId}='${id}'
    //     ORDER BY ${ACHI_USER_TBL_KEYS.isDone} DESC, ${ACHI_TBL_KEYS.tblName}.${ACHI_TBL_KEYS.id}
    //   `,
    // );
  }

  async updateProgress(achievementId: number, userId: string) {
    const achievement = await this.achievementFindOne(achievementId);
    const achievementUser = await this.achievementUserFindOneCreateIfNotExist(
      achievementId,
      userId,
    );
    if (achievementUser.isDone) {
      throw new HttpException(
        `Achivement is already completed`,
        HttpStatus.NOT_ACCEPTABLE,
      );
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
    achievementId: number,
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
      return this.achiUserRepo.create(achievementUser);
    }

    return achievementUser;
  }

  async achievementFindOne(achievementId: number) {
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
}
