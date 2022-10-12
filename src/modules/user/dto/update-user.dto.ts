import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto {
  constructor(name?: string, matchCount?: number) {
    this.name = name;
    this.matchCount = matchCount;
  }

  name?: string;

  matchCount?: number;
}
