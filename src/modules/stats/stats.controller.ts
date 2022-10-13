import { Controller, Get, Param } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('/leaderboard')
  getLeaderboard() {
    return this.statsService.getLeaderboard();
  }

  @Get('/user/:id')
  findUserStat(@Param('id') id: string) {
    return this.statsService.findOneById(id);
  }
}
