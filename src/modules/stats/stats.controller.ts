import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtAuthUser } from '../auth/jwt/jwt-extractor';
import { User } from '../user/entities/user.entity';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/leaderboard')
  getLeaderboard() {
    return this.statsService.getLeaderboard();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  findUserStat(@JwtAuthUser() user: User) {
    return this.statsService.findOneById(user.id);
  }
}
