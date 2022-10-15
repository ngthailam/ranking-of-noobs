import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';
import { ValidMove } from '../dto/make-move.dto';

export const MATCH_TBL_KEYS = {
  tblName: 'matches',
  id: 'id',
  primaryUserId: 'primary_user_id',
  secondaryUserId: 'secondary_user_id',
  primaryUserMove: 'primary_user_move',
  secondaryUserMove: 'secondary_user_move',
  isPrimaryUserSeenResult: 'is_primary_user_seen_result',
  isSecondaryUserSeenResult: 'is_secondary_user_seen_result',
  desc: 'desc',
  createdAt: 'created_at',
};

export enum MatchResult {
  NONE = 'NONE',
  WIN = 'WIN',
  DRAW = 'DRAW',
  LOSE = 'LOSE',
}

@Entity({ name: MATCH_TBL_KEYS.tblName })
export class Match {
  @PrimaryGeneratedColumn('uuid', { name: MATCH_TBL_KEYS.id })
  id: string;

  @Column({ name: MATCH_TBL_KEYS.primaryUserId })
  primaryUserId: string;

  @Column({
    name: MATCH_TBL_KEYS.primaryUserMove,
    type: 'enum',
    enum: ValidMove,
    nullable: true,
  })
  primaryUserMove: ValidMove;

  @Column({ name: MATCH_TBL_KEYS.secondaryUserId })
  secondaryUserId: string;

  @Column({
    name: MATCH_TBL_KEYS.secondaryUserMove,
    type: 'enum',
    enum: ValidMove,
    nullable: true,
  })
  secondaryUserMove: ValidMove;

  @Column({ name: MATCH_TBL_KEYS.isPrimaryUserSeenResult, default: false })
  isPrimaryUserSeenResult: boolean;

  @Column({ name: MATCH_TBL_KEYS.isSecondaryUserSeenResult, default: false })
  isSecondaryUserSeenResult: boolean;

  @Column({ name: MATCH_TBL_KEYS.desc, default: '' })
  desc: string;

  @CreateDateColumn({
    name: MATCH_TBL_KEYS.createdAt,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
