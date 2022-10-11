import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export const MATCH_TBL_KEYS = {
  tblName: 'matches',
  id: 'id',
};

@Entity({ name: MATCH_TBL_KEYS.tblName })
export class Match {
  @PrimaryGeneratedColumn('uuid', { name: MATCH_TBL_KEYS.id })
  id: number;
}
