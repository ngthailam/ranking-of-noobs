import { Match } from "src/modules/match/entities/match.entity";

export class CreateMatchHistoryDto {
  id: string;

  matchDate: Date;

  static from(match: Match): CreateMatchHistoryDto {
    const matchHistoryDto = new CreateMatchHistoryDto();
    matchHistoryDto.id = match.id;
    matchHistoryDto.matchDate = match.createdAt;
    return matchHistoryDto;
  }
}
