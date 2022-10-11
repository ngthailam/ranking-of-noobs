import { CONSTS } from 'src/core/const/constants';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export const USER_TBL_KEYS = {
  tblName: 'users',
  id: 'id',
  name: 'name',
  elo: 'elo',
};

@Entity({ name: USER_TBL_KEYS.tblName })
export class User {
  @PrimaryGeneratedColumn('uuid', { name: USER_TBL_KEYS.id })
  id: string;

  @Column({ name: USER_TBL_KEYS.name })
  name: string;

  @Column({ name: USER_TBL_KEYS.elo, default: CONSTS.baseElo })
  elo: number;
}
