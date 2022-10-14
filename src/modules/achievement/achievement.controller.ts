import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtAuthUser } from '../auth/jwt/jwt-extractor';
import { User } from '../user/entities/user.entity';
import { AchievementService } from './achievement.service';

@Controller('achievement')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Get('/user/list')
  @UseGuards(JwtAuthGuard)
  getAllByUserId(
    @JwtAuthUser() user: User,
    @Query('done') done: string = 'false',
  ) {
    return this.achievementService.findAllByUserId(user.id, done == 'true');
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll() {
    return this.achievementService.findAll();
  }

  @Get('/populate')
  populateAchievements() {
    return this.achievementService.populateAchievements();
  }
}
