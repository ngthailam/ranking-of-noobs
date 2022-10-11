import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchUser } from './entities/match-user';
import { MatchUserService } from './match-user.service';

@Module({
  imports: [TypeOrmModule.forFeature([MatchUser])],
  providers: [MatchUserService],
  exports: [MatchUserService],
})
export class MatchUserModule {}
