import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { MatchModule } from './modules/match/match.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchHistoryModule } from './modules/match-history/match-history.module';
import { StatsModule } from './modules/stats/stats.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskSchedulingModule } from './modules/task-scheduling/task-scheduling.module';
import { AchievementModule } from './modules/achievement/achievement.module';

@Module({
  imports: [
    MatchModule,
    UserModule,
    MatchHistoryModule,
    StatsModule,
    TaskSchedulingModule,
    AchievementModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'admin',
        password: '',
        database: 'rankings_of_noobs',
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
