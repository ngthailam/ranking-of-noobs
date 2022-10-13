import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ValidMove } from './make-move.dto';

export class SimulateFixedDto {
  @IsString()
  @IsNotEmpty()
  primaryUserId: string;

  @IsString()
  @IsNotEmpty()
  secondaryUserId: string;

  @IsEnum(ValidMove)
  primaryUserMove: ValidMove;

  @IsEnum(ValidMove)
  secondaryUserMove: ValidMove;
}
