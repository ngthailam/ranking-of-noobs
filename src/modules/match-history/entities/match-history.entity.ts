import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

export const MATCH_HISTORY_TBL_KEYS = {
  tblName: 'match_histories',
  id: 'id',
  matchDate: 'match_date',
};

@Entity({ name: MATCH_HISTORY_TBL_KEYS.tblName })
export class MatchHistory {
  @PrimaryColumn({ name: MATCH_HISTORY_TBL_KEYS.id })
  id: string;

  @Column({
    name: MATCH_HISTORY_TBL_KEYS.matchDate,
    type: 'timestamp',
    nullable: true,
  })
  matchDate: Date;
}
