export class UpdateUserResultDto {
  constructor(matchCount?: number, elo?: number) {
    this.matchCount = matchCount;
    this.elo = elo;
  }

  matchCount?: number;

  elo?: number;
}
