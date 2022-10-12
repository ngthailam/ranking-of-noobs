import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { MatchResultDto } from './dto/match-result.dto';
import { UserService } from '../user/user.service';

@Controller('match')
export class MatchController {
  constructor(
    private readonly matchService: MatchService,
    private readonly userService: UserService,
  ) {}

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

  @Get('create/:count')
  async simulate(@Param('count') count: string) {
    console.log('BEGIN simulate matches .....');
    const results = ['WIN', 'DRAW', 'LOSE'];

    for (let i = 0; i < +count; i++) {
      const randomUser = await this.userService.findRandom();
      const createMatchDto = new CreateMatchDto();
      createMatchDto.userId = randomUser.id;
      const match = await this.createMatch(createMatchDto);

      const matchResultDto = new MatchResultDto();
      matchResultDto.matchId = match.id;
      matchResultDto.primaryUserId = randomUser.id;

      const randIndex = this.getRandomInt(0, 3);
      matchResultDto.result = results[randIndex];

      console.log(
        `==== COUNT= ${i} match=${match.id} - ${randomUser.id} - ${matchResultDto.matchId} - ${matchResultDto.primaryUserId} - RESULT=${matchResultDto.result}`,
      );

      await this.matchService.setResult(matchResultDto);
    }
    console.log('DONE simulate matches .....');

    return 'DONE';
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }
}
