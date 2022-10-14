import { USER_RANK_THRESHOLD } from '../user/entities/user.entity';
import { Achievement } from './entities/achievement.entity';
import { ACHI_USER_TBL_KEYS } from './entities/achievements-users.entity';

export const ACHIEVEMENT_KEY = {
  GAMES_1: 'GAMES_1',
  GAMES_10: 'GAMES_10',
  ROCK_USER: 'ROCK_USER',
  PAPER_USER: 'PAPER_USER',
  SCISSORS_USER: 'SCISSORS_USER',
  DIAMOND_USER: 'DIAMOND_USER',
  LOSER_1: 'LOSER_1',
  WINER_1: 'WINNER_1'
};

export const ACHIVEMENT_CONST = {
  ONE_OFF: ACHI_USER_TBL_KEYS.defaultProgress + 1,
};

export class AchievementStore {
  static version: number = 2;

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
        'Complete 10 more games',
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
      new Achievement(
        ACHIEVEMENT_KEY.LOSER_1,
        'I...I lost?',
        `Lose for the first time`,
        ACHIVEMENT_CONST.ONE_OFF,
      ),
      new Achievement(
        ACHIEVEMENT_KEY.WINER_1,
        'Born a Winner',
        `Win for the first time`,
        ACHIVEMENT_CONST.ONE_OFF,
      ),
    ];
  }
}
