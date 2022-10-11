import { Module } from '@nestjs/common';
import { MatchHistoryService } from './match-history.service';
import { MatchHistoryController } from './match-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchHistory } from './entities/match-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatchHistory])],
  controllers: [MatchHistoryController],
  providers: [MatchHistoryService],
  exports: [MatchHistoryService],
})
export class MatchHistoryModule {}
