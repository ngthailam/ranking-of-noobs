import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export const MATCH_TBL_KEYS = {
  tblName: 'matches',
  id: 'id',
  createdAt: 'created_at',
};

export enum MatchResult {
  NONE,
  WIN,
  DRAW,
  LOSE,
}

@Entity({ name: MATCH_TBL_KEYS.tblName })
export class Match {
  @PrimaryGeneratedColumn('uuid', { name: MATCH_TBL_KEYS.id })
  id: string;

  @CreateDateColumn({
    name: MATCH_TBL_KEYS.createdAt,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
