import { USER_RANK_THRESHOLD } from '../user/entities/user.entity';
import { Achievement } from './entities/achievement.entity';
import { ACHI_USER_TBL_KEYS } from './entities/achievements-users.entity';

export const ACHIEVEMENT_KEY = {
  GAMES_1: 1,
  GAMES_10: 2,
  ROCK_USER: 3,
  PAPER_USER: 4,
  SCISSORS_USER: 5,
  DIAMOND_USER: 6,
};

export const ACHIVEMENT_CONST = {
  ONE_OFF: ACHI_USER_TBL_KEYS.defaultProgress + 1,
};

export class AchievementStore {
  static version: number = 1;

  static getAchievements(): Achievement[] {
    return [
      new Achievement(
        ACHIEVEMENT_KEY.GAMES_1,
        'What does this button do?',
        'Play your first game',
        ACHIVEMENT_CONST.ONE_OFF,
      ),
      new Achievement(
        ACHIEVEMENT_KEY.GAMES_10,
        'Noob graduate',
        'Complete 10 games',
        ACHI_USER_TBL_KEYS.defaultProgress + 10,
      ),
      new Achievement(
        ACHIEVEMENT_KEY.ROCK_USER,
        'Make a fist',
        'Use rock once',
        ACHIVEMENT_CONST.ONE_OFF,
      ),
      new Achievement(
        ACHIEVEMENT_KEY.PAPER_USER,
        'Spread your fingers',
        'User papaer once',
        ACHIVEMENT_CONST.ONE_OFF,
      ),
      new Achievement(
        ACHIEVEMENT_KEY.SCISSORS_USER,
        'Peace Sign',
        'Use scissors once',
        ACHIVEMENT_CONST.ONE_OFF,
      ),
      new Achievement(
        ACHIEVEMENT_KEY.DIAMOND_USER,
        'Shine bright like a Diamond',
        `Achieve rank Diamond with at least ${USER_RANK_THRESHOLD.DIAMOND} elo`,
        ACHIVEMENT_CONST.ONE_OFF,
      ),
    ];
  }
}
