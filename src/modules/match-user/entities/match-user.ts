import { ValidMove } from 'src/modules/match/dto/make-move.dto';
import { MATCH_TBL_KEYS } from 'src/modules/match/entities/match.entity';
import { USER_TBL_KEYS } from 'src/modules/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const MATCH_USER_TBL_KEYS = {
  tblName: `${MATCH_TBL_KEYS.tblName}_${USER_TBL_KEYS.tblName}`,
  id: 'id',
  matchId: 'matchId',
  userId: 'userId',
  move: 'move',
};

@Entity({ name: MATCH_USER_TBL_KEYS.tblName })
export class MatchUser {
  constructor(matchId?: string, userId?: string) {
    this.matchId = matchId;
    this.userId = userId;
  }

  @PrimaryGeneratedColumn('uuid', { name: MATCH_USER_TBL_KEYS.id })
  id: string;

  @Column({ name: MATCH_USER_TBL_KEYS.matchId })
  matchId: string;

  @Column({ name: MATCH_USER_TBL_KEYS.userId })
  userId: string;

  @Column({
    name: MATCH_USER_TBL_KEYS.move,
    type: 'enum',
    enum: ValidMove,
    nullable: true,
  })
  move?: ValidMove;
}
