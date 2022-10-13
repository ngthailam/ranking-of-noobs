import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UserService } from '../user/user.service';
import { randomInt } from 'src/core/utils/random';
import { MakeMoveDto, ValidMove } from './dto/make-move.dto';
import { SimulateFixedDto } from './dto/simulate-fixed.dto';

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

  @Get()
  getAll() {
    return this.matchService.findAll();
  }

  @Post('/make-move')
  makeMove(@Body() makeMoveDto: MakeMoveDto) {
    return this.matchService.makeMove(makeMoveDto);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.matchService.findOne(id);
  }

  @Get('/pending/:uid')
  getByUserId(@Param('uid') uid: string) {
    return this.matchService.findAllByUserId(uid);
  }

  /**
   * This is only for testing
   * @param count
   * @returns
   */
  @Get('create/:count')
  async simulate(@Param('count') count: string) {
    console.log('BEGIN simulate matches .....');
    const moves = [ValidMove.ROCK, ValidMove.PAPER, ValidMove.SCISSORS];

    // TODO: refactor: use this.simulateFixed instead

    for (let i = 0; i < +count; i++) {
      const randomPrimaryUser = await this.userService.findRandom();
      const randomSecondaryUser = await this.userService.findRandomExclude(
        randomPrimaryUser.id,
      );

      const randIndex1 = randomInt(0, 3);
      const randIndex2 = randomInt(0, 3);
      const primaryUserMove = moves[randIndex1];
      const secondaryUserMove = moves[randIndex2];

      const simulateFixedDto = new SimulateFixedDto();
      simulateFixedDto.primaryUserId = randomPrimaryUser.id;
      simulateFixedDto.secondaryUserId = randomSecondaryUser.id;
      simulateFixedDto.primaryUserMove = primaryUserMove;
      simulateFixedDto.secondaryUserMove = secondaryUserMove;

      await this.simulateFixed(simulateFixedDto);

      console.log(
        `==== COUNT= ${i} - ${randomPrimaryUser.id}:${primaryUserMove} - ${randomSecondaryUser.id}:${secondaryUserMove}`,
      );
    }
    console.log('DONE simulate matches .....');

    return 'DONE';
  }

  /**
   * This is only for testing
   * @returns
   */
  @Get('create/simulate/fixed')
  async simulateFixed(@Body() fixedDto: SimulateFixedDto) {
    console.log('BEGIN simulateFixed .....');
    // Create match
    const createMatchDto = new CreateMatchDto();
    createMatchDto.userId = fixedDto.primaryUserId;
    createMatchDto.opponentId = fixedDto.secondaryUserId;
    const match = await this.createMatch(createMatchDto);

    console.log(`[Simulate] Match=${JSON.stringify(match)}`);

    // Make 2 moves
    const primaryUserMoveDto = new MakeMoveDto();
    primaryUserMoveDto.matchId = match.id;
    primaryUserMoveDto.userId = fixedDto.primaryUserId;
    primaryUserMoveDto.move = fixedDto.primaryUserMove;
    await this.matchService.makeMove(primaryUserMoveDto);

    const secondaryUserMoveDto = new MakeMoveDto();
    secondaryUserMoveDto.matchId = match.id;
    secondaryUserMoveDto.userId = fixedDto.secondaryUserId;
    secondaryUserMoveDto.move = fixedDto.secondaryUserMove;
    await this.matchService.makeMove(secondaryUserMoveDto);

    return 'DONE';
  }
}
