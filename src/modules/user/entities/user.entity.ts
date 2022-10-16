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

export const USER_RANK_THRESHOLD = {
  BRONZE: 800,
  SILVER: 900,
  GOLD: 1000,
  DIAMOND: 1100,
  CHALLENGER: 1200, // Only top 100 user
};

export class UserRankCalculator {
  static calculate(elo: number): UserRank {
    if (elo >= USER_RANK_THRESHOLD.CHALLENGER) return UserRank.CHALLENGER;
    if (elo >= USER_RANK_THRESHOLD.DIAMOND) return UserRank.DIAMOND;
    if (elo >= USER_RANK_THRESHOLD.GOLD) return UserRank.GOLD;
    if (elo >= USER_RANK_THRESHOLD.SILVER) return UserRank.SILVER;
    if (elo >= USER_RANK_THRESHOLD.BRONZE) return UserRank.BRONZE;

    return UserRank.NONE;
  }
}

@Entity({ name: USER_TBL_KEYS.tblName })
export class User {
  @PrimaryGeneratedColumn('uuid', { name: USER_TBL_KEYS.id })
  id: string;

  @Column({ name: USER_TBL_KEYS.name, unique: true })
  name: string;

  @Column({ name: USER_TBL_KEYS.elo, default: CONSTS.baseElo })
  elo: number;

  // TODO: do I really need match count? it is in stats table anyways
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
