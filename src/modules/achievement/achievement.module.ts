import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './entities/achievement.entity';
import { AchievementsUsers } from './entities/achievements-users.entity';
import { UserModule } from '../user/user.module';
import { StatsModule } from '../stats/stats.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Achievement, AchievementsUsers]),
    UserModule,
    StatsModule,
  ],
  controllers: [AchievementController],
  providers: [AchievementService],
})
export class AchievementModule {}
