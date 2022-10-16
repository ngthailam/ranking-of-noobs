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
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseWrapperInterceptor } from './core/interceptors/response-wrapper.interceptor';
import { WebSocketModule } from './modules/events/web-socket.module';

@Module({
  imports: [
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
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    MatchModule,
    UserModule,
    MatchHistoryModule,
    StatsModule,
    TaskSchedulingModule,
    AchievementModule,
    AuthModule,
    HealthModule,
    WebSocketModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseWrapperInterceptor,
    },
  ],
})
export class AppModule {}
