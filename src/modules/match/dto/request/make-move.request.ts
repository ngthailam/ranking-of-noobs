import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ValidMove } from '../make-move.dto';

export class MakeMoveRequest {
  @IsEnum(ValidMove)
  move: ValidMove;

  @IsString()
  @IsNotEmpty()
  matchId: string;
}
