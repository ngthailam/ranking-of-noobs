import { CONSTS } from 'src/core/const/constants';
import { MatchResult } from '../entities/match.entity';

export class EloCalculator {
  static calculate(
    primaryElo: number,
    secondaryElo: number,
    primaryMatchResult: MatchResult,
  ) {
    const eloDiff = Math.abs(primaryElo - secondaryElo);
    const ratioDiff = eloDiff / CONSTS.eloRange;

    const expectedScore = 1 / (1 + Math.pow(10, ratioDiff));
    let gameOutcome = 0;

    switch (primaryMatchResult) {
      case MatchResult.WIN:
        gameOutcome = 1;
        break;
      case MatchResult.DRAW:
        gameOutcome = 0.5;
        break;
      case MatchResult.LOSE:
        gameOutcome = 0;
        break;
    }

    console.log(`Outcome = ${gameOutcome}-${primaryMatchResult}`)

    const eloChange = CONSTS.kFactor * (gameOutcome - expectedScore);

    return Math.ceil(eloChange);
  }
}
