import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ValidMove } from './make-move.dto';

export class SimulateFixedDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  primaryUserId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  secondaryUserId: string;

  @IsEnum(ValidMove)
  @ApiProperty()
  primaryUserMove: ValidMove;

  @IsEnum(ValidMove)
  @ApiProperty()
  secondaryUserMove: ValidMove;
}
