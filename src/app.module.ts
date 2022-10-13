import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { MatchModule } from './modules/match/match.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchHistoryModule } from './modules/match-history/match-history.module';
import { StatsModule } from './modules/stats/stats.module';

@Module({
  imports: [
    MatchModule,
    UserModule,
    MatchHistoryModule,
    StatsModule,
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
