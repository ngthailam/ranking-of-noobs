import { ValidMove } from 'src/modules/match/dto/make-move.dto';
import { Match, MatchResult } from 'src/modules/match/entities/match.entity';
import { MatchResultCalculator } from 'src/modules/match/utils/win-lose-calculator';

export class CreateMatchHistoryDto {
  id: string;

  matchDate: Date;

  primaryUserId: string;

  primaryUserMove: ValidMove;

  secondaryUserId: string;

  secondaryUserMove: ValidMove;

  result: MatchResult;

  static from(match: Match): CreateMatchHistoryDto {
    const matchHistoryDto = new CreateMatchHistoryDto();
    matchHistoryDto.id = match.id;
    matchHistoryDto.matchDate = match.createdAt;
    matchHistoryDto.primaryUserId = match.primaryUserId;
    matchHistoryDto.primaryUserMove = match.primaryUserMove;
    matchHistoryDto.secondaryUserId = match.secondaryUserId;
    matchHistoryDto.secondaryUserMove = match.secondaryUserMove;
    matchHistoryDto.result = MatchResultCalculator.calculate(
      matchHistoryDto.primaryUserMove,
      matchHistoryDto.secondaryUserMove,
    );
    return matchHistoryDto;
  }
}
