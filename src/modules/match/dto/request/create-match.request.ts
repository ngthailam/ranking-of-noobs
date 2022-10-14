import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchRequest {
  @ApiProperty({ required: false })
  opponentId?: string;

  @ApiProperty({ required: false })
  desc?: string;
}
