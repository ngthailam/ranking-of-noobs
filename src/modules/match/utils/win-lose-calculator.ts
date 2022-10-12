import { ValidMove } from '../dto/make-move.dto';
import { MatchResult } from '../entities/match.entity';

const RESULT_MAP = new Map<ValidMove, Map<ValidMove, MatchResult>>([
  [
    ValidMove.ROCK,
    new Map<ValidMove, MatchResult>([
      [ValidMove.ROCK, MatchResult.DRAW],
      [ValidMove.PAPER, MatchResult.LOSE],
      [ValidMove.SCISSORS, MatchResult.WIN],
    ]),
  ],
  [
    ValidMove.PAPER,
    new Map<ValidMove, MatchResult>([
      [ValidMove.ROCK, MatchResult.WIN],
      [ValidMove.PAPER, MatchResult.DRAW],
      [ValidMove.SCISSORS, MatchResult.LOSE],
    ]),
  ],
  [
    ValidMove.SCISSORS,
    new Map<ValidMove, MatchResult>([
      [ValidMove.ROCK, MatchResult.LOSE],
      [ValidMove.PAPER, MatchResult.WIN],
      [ValidMove.SCISSORS, MatchResult.DRAW],
    ]),
  ],
]);

export class MatchResultCalculator {
  static calculate(
    primaryUserMove: ValidMove,
    secondaryUserMove: ValidMove,
  ): MatchResult {
    return RESULT_MAP.get(primaryUserMove).get(secondaryUserMove);
  }
}
