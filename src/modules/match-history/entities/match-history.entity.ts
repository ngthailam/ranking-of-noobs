import { ValidMove } from 'src/modules/match/dto/make-move.dto';
import { MatchResult } from 'src/modules/match/entities/match.entity';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

export const MATCH_HISTORY_TBL_KEYS = {
  tblName: 'match_histories',
  id: 'id',
  primaryUserId: 'primary_user_id',
  secondaryUserId: 'secondary_user_id',
  primaryUserMove: 'primary_user_move',
  secondaryUserMove: 'secondary_user_move',
  result: 'result',
  matchDate: 'match_date',
};

@Entity({ name: MATCH_HISTORY_TBL_KEYS.tblName })
export class MatchHistory {
  @PrimaryColumn({ name: MATCH_HISTORY_TBL_KEYS.id })
  id: string;

  @Column({ name: MATCH_HISTORY_TBL_KEYS.primaryUserId })
  primaryUserId: string;

  @Column({
    name: MATCH_HISTORY_TBL_KEYS.primaryUserMove,
    type: 'enum',
    enum: ValidMove,
  })
  primaryUserMove: ValidMove;

  @Column({ name: MATCH_HISTORY_TBL_KEYS.secondaryUserId })
  secondaryUserId: string;

  @Column({
    name: MATCH_HISTORY_TBL_KEYS.secondaryUserMove,
    type: 'enum',
    enum: ValidMove,
  })
  secondaryUserMove: ValidMove;

  @Column({
    name: MATCH_HISTORY_TBL_KEYS.result,
    type: 'enum',
    enum: MatchResult,
  })
  result: MatchResult;

  @Column({
    name: MATCH_HISTORY_TBL_KEYS.matchDate,
    type: 'timestamp',
    nullable: true,
  })
  matchDate: Date;
}
