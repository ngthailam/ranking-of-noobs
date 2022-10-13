import { Controller, Get, Param, Query } from '@nestjs/common';
import { MatchHistoryService } from './match-history.service';
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
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.matchHistoryService.findAllByUserIdLimitOffset(
      uid,
      limit ?? CONSTS.defaultHistoryLimit,
      offset ?? 0,
    );
  }
}
