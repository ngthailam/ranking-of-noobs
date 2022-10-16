import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { UserModule } from '../user/user.module';
import { MatchHistoryModule } from '../match-history/match-history.module';
import { StatsModule } from '../stats/stats.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match]),
    UserModule,
    MatchHistoryModule,
    StatsModule,
    AuthModule,
  ],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService]
})
export class MatchModule {}
