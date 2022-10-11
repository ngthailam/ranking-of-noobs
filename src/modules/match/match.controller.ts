import {
  Controller,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { MatchResultDto } from './dto/match-result.dto';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post('')
  createMatch(@Body() createMatchDto: CreateMatchDto) {
    return this.matchService.createMatch(createMatchDto);
  }

  @Post('/result')
  setResult(@Body() matchResultDto: MatchResultDto) {
    return this.matchService.setResult(matchResultDto);
  }

  @Get()
  findAll() {
    return this.matchService.findAll();
  }
}
