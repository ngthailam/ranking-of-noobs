import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ValidMove } from '../make-move.dto';

export class MakeMoveRequest {
  @ApiProperty({ enum: [ValidMove.ROCK, ValidMove.PAPER, ValidMove.SCISSORS]})
  @IsEnum(ValidMove)
  move: ValidMove;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  matchId: string;
}
