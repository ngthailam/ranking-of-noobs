import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const ACHI_USER_TBL_KEYS = {
  tblName: 'achievements_users',
  id: 'id',
  achievementId: 'achievement_id',
  userId: 'user_id',
  progress: 'progress',
  isDone: 'is_done',

  defaultProgress: 0,
};

@Entity({ name: ACHI_USER_TBL_KEYS.tblName })
export class AchievementsUsers {
  @PrimaryGeneratedColumn('uuid', { name: ACHI_USER_TBL_KEYS.id })
  id: string;

  @Column({ name: ACHI_USER_TBL_KEYS.achievementId })
  achievementId: string;

  @Column({ name: ACHI_USER_TBL_KEYS.userId })
  userId: string;

  @Column({
    name: ACHI_USER_TBL_KEYS.progress,
    default: ACHI_USER_TBL_KEYS.defaultProgress,
  })
  progress: number;

  @Column({ name: ACHI_USER_TBL_KEYS.isDone, default: false })
  isDone: boolean;
}
