import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

export const ACHI_TBL_KEYS = {
  tblName: 'achievements',
  id: 'id',
  max: 'max',
  title: 'title',
  desc: 'desc',
};

@Entity({ name: ACHI_TBL_KEYS.tblName })
export class Achievement {
  constructor(id: string, title: string, desc: string, max: number) {
    this.id = id;
    this.title = title;
    this.desc = desc;
    this.max = max;
  }

  @PrimaryColumn({ name: ACHI_TBL_KEYS.id })
  id: string;

  @Column({ name: ACHI_TBL_KEYS.title })
  title: string;

  @Column({ name: ACHI_TBL_KEYS.desc })
  desc: string;

  @Column({ name: ACHI_TBL_KEYS.max })
  max: number;
}
