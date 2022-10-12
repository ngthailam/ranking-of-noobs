import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum ValidMove {
  ROCK = 'ROCK',
  PAPER = 'PAPER',
  SCISSORS = 'SCISSORS',
}

export class MakeMoveDto {
  @IsEnum(ValidMove)
  move: ValidMove;

  @IsString()
  @IsNotEmpty()
  matchId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
