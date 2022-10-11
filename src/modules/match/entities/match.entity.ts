import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export const MATCH_TBL_KEYS = {
  tblName: 'matches',
  id: 'id',
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
}
