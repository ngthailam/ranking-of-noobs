import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtAuthUser } from '../auth/jwt/jwt-extractor';
import { User } from '../user/entities/user.entity';
import { StatsService } from './stats.service';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

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
