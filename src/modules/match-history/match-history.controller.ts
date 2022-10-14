import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { MatchHistoryService } from './match-history.service';
import { CONSTS } from 'src/core/const/constants';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtAuthUser } from '../auth/jwt/jwt-extractor';
import { User } from '../user/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('match history')
@Controller('match-history')
export class MatchHistoryController {
  constructor(private readonly matchHistoryService: MatchHistoryService) {}

  @Get()
  getAll() {
    return this.matchHistoryService.findAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.matchHistoryService.findOne(id);
  }

  @Get('user/list')
  @UseGuards(JwtAuthGuard)
  getByUserId(
    @JwtAuthUser() user: User,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.matchHistoryService.findAllByUserIdLimitOffset(
      user.id,
      limit ?? CONSTS.defaultHistoryLimit,
      offset ?? 0,
    );
  }
}
