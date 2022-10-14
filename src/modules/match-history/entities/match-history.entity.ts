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
  primaryUserEloBefore: 'primary_user_elo_before',
  primaryUserEloAfter: 'primary_user_elo_after',
  primaryUserEloChange: 'primary_user_elo_change',
  secondaryUserEloBefore: 'secondary_user_elo_before',
  secondaryUserEloAfter: 'secondary_user_elo_after',
  secondaryUserEloChange: 'secondary_user_elo_change',
  result: 'result',
  desc: 'desc',
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

  @Column({ name: MATCH_HISTORY_TBL_KEYS.primaryUserEloBefore, default: 0 })
  primaryUserEloBefore: number;

  @Column({ name: MATCH_HISTORY_TBL_KEYS.primaryUserEloAfter, default: 0 })
  primaryUserEloAfter: number;

  @Column({ name: MATCH_HISTORY_TBL_KEYS.primaryUserEloChange, default: 0 })
  primaryUserEloChange: number;

  @Column({ name: MATCH_HISTORY_TBL_KEYS.secondaryUserEloBefore, default: 0 })
  secondaryUserEloBefore: number;

  @Column({ name: MATCH_HISTORY_TBL_KEYS.secondaryUserEloAfter, default: 0 })
  secondaryUserEloAfter: number;

  @Column({ name: MATCH_HISTORY_TBL_KEYS.secondaryUserEloChange, default: 0 })
  secondaryUserEloChange: number;

  @Column({ name: MATCH_HISTORY_TBL_KEYS.desc, default: '' })
  desc: string;

  @Column({
    name: MATCH_HISTORY_TBL_KEYS.matchDate,
    type: 'timestamp',
    nullable: true,
  })
  matchDate: Date;
}
