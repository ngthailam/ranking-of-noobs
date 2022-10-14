import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AchievementService } from './achievement.service';

@Controller('achievement')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Get('/user/:id')
  getAllByUserId(@Param('id') id: string) {
    return this.achievementService.findAllByUserId(id);
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
