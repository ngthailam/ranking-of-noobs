import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { MatchHistoryService } from './match-history.service';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';
import { CONSTS } from 'src/core/const/constants';

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

  @Get('user/:uid')
  getByUserId(
    @Param('uid') uid: string,
    @Query('limit') limit: number = CONSTS.defaultHistoryLimit,
    @Query('offset') offset: number = 0,
  ) {
    return this.matchHistoryService.findAllByUserIdLimitOffset(
      uid,
      limit,
      offset,
    );
  }
}
