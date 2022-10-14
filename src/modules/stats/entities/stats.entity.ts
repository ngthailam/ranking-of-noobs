import { Column, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';

export const STATS_TBL_KEYS = {
  tblName: 'stats',
  id: 'id',
  winCount: 'win_count',
  drawCount: 'draw_count',
  loseCount: 'lose_count',
  highestElo: 'highest_elo',
  lowestElo: 'lowest_elo',
  updatedAt: 'updated_at',
  paperCount: 'paper_count',
  rockCount: 'rock_count',
  scissorsCount: 'scissors_count',
};

@Entity({ name: STATS_TBL_KEYS.tblName })
export class Stats {
  @PrimaryColumn({ name: STATS_TBL_KEYS.id })
  id: string;

  @Column({ name: STATS_TBL_KEYS.winCount, default: 0 })
  winCount: number;

  @Column({ name: STATS_TBL_KEYS.drawCount, default: 0 })
  drawCount: number;

  @Column({ name: STATS_TBL_KEYS.loseCount, default: 0 })
  loseCount: number;

  @Column({ name: STATS_TBL_KEYS.highestElo, default: 0 })
  highestElo: number;

  @Column({ name: STATS_TBL_KEYS.lowestElo, default: 9999 })
  lowestElo: number;

  @Column({ name: STATS_TBL_KEYS.paperCount, default: 0 })
  paperCount: number;

  @Column({ name: STATS_TBL_KEYS.rockCount, default: 0 })
  rockCount: number;

  @Column({ name: STATS_TBL_KEYS.scissorsCount, default: 0 })
  scissorsCount: number;

  @UpdateDateColumn({ name: STATS_TBL_KEYS.updatedAt })
  updatedAt: Date;

  getMatchCount(): number {
    return this.winCount + this.drawCount + this.loseCount;
  }
}
