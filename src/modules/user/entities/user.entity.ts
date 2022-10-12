import { CONSTS } from 'src/core/const/constants';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export const USER_TBL_KEYS = {
  tblName: 'users',
  id: 'id',
  name: 'name',
  elo: 'elo',
  matchCount: 'match_count',
  rank: 'rank',
};

export enum UserRank {
  NONE,
  BRONZE,
  GOLD,
  DIAMOND,
  CHALLENGER, // Only top 100 user
}

@Entity({ name: USER_TBL_KEYS.tblName })
export class User {
  @PrimaryGeneratedColumn('uuid', { name: USER_TBL_KEYS.id })
  id: string;

  @Column({ name: USER_TBL_KEYS.name })
  name: string;

  @Column({ name: USER_TBL_KEYS.elo, default: CONSTS.baseElo })
  elo: number;

  @Column({ name: USER_TBL_KEYS.matchCount, default: 0 })
  matchCount: number;

  @Column({
    name: USER_TBL_KEYS.rank,
    type: 'enum',
    enum: UserRank,
    default: UserRank.NONE,
  })
  rank: UserRank;
}
