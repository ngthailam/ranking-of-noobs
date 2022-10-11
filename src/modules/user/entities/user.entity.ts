import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export const USER_TBL_KEYS = {
  tblName: 'users',
  id: 'id',
  name: 'name',
};

@Entity({ name: USER_TBL_KEYS.tblName })
export class User {
  @PrimaryGeneratedColumn('uuid', { name: USER_TBL_KEYS.id })
  id: number;

  @Column({ name: USER_TBL_KEYS.name })
  name: string;
}
