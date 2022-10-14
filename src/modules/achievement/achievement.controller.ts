import { Controller, Get, Param, Query } from '@nestjs/common';
import { AchievementService } from './achievement.service';

@Controller('achievement')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Get('/user/:id')
  getAllByUserId(
    @Param('id') id: string,
    @Query('done') done: string = 'false',
  ) {
    return this.achievementService.findAllByUserId(id, done == 'true');
  }

  @Get()
  getAll() {
    return this.achievementService.findAll();
  }

  @Get('/populate')
  populateAchievements() {
    return this.achievementService.populateAchievements();
  }
}
