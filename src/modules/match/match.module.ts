import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from './entities/match.entity';
import { UserModule } from '../user/user.module';
import { MatchUserModule } from '../match-user/match-user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Match]), UserModule, MatchUserModule],
  controllers: [MatchController],
  providers: [MatchService],
})
export class MatchModule {}
