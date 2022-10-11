import { IsNotEmpty, IsString } from 'class-validator';

export class MatchResultDto {
  @IsString()
  @IsNotEmpty()
  matchId: string;

  @IsString()
  @IsNotEmpty()
  result: string;

  primaryUserId: string;
}
