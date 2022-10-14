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

  primaryUserEloBefore: number;

  primaryUserEloAfter: number;

  primaryUserEloChange: number;

  secondaryUserEloBefore: number;

  secondaryUserEloAfter: number;
  
  secondaryUserEloChange: number;

  static from(
    match: Match,
    primaryUserEloBefore: number,
    primaryUserEloAfter: number,
    secondaryUserEloBefore: number,
    secondaryUserEloAfter: number,
  ): CreateMatchHistoryDto {
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

    matchHistoryDto.primaryUserEloBefore = primaryUserEloBefore;
    matchHistoryDto.primaryUserEloAfter = primaryUserEloAfter;
    matchHistoryDto.primaryUserEloChange =
      primaryUserEloAfter - primaryUserEloBefore;
    matchHistoryDto.secondaryUserEloBefore = secondaryUserEloBefore;
    matchHistoryDto.secondaryUserEloAfter = secondaryUserEloAfter;
    matchHistoryDto.secondaryUserEloChange =
      secondaryUserEloAfter - secondaryUserEloBefore;

    return matchHistoryDto;
  }
}
