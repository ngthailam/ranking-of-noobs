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
  NONE = 'NONE',
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  DIAMOND = 'DIAMOND',
  CHALLENGER = 'CHALLENGER', // Only top 100 user
}

export class UserRankCalculator {
  static calculate(elo: number): UserRank {
    if (elo > 1800) return UserRank.CHALLENGER;
    if (elo > 1500) return UserRank.DIAMOND;
    if (elo > 1200) return UserRank.GOLD;
    if (elo > 900) return UserRank.SILVER;
    if (elo > 600) return UserRank.BRONZE;

    return UserRank.NONE;
  }
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
