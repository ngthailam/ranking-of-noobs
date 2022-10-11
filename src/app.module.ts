import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { MatchModule } from './modules/match/match.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchUserModule } from './modules/match-user/match-user.module';
import { MatchHistoryModule } from './modules/match-history/match-history.module';

@Module({
  imports: [
    MatchModule,
    UserModule,
    MatchUserModule,
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
    MatchHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
