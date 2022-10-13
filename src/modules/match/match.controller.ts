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
  findAll() {
    return this.matchService.findAll();
  }

  @Post('/make-move')
  makeMove(@Body() makeMoveDto: MakeMoveDto) {
    return this.matchService.makeMove(makeMoveDto);
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

      const createMatchDto = new CreateMatchDto();
      createMatchDto.userId = randomPrimaryUser.id;
      createMatchDto.opponentId = randomSecondaryUser.id;
      const match = await this.createMatch(createMatchDto);

      const randIndex1 = randomInt(0, 3);
      const randIndex2 = randomInt(0, 3);

      const primaryUserMove = moves[randIndex1];
      const secondaryUserMove = moves[randIndex2];

      // Make 2 moves
      const primaryUserMoveDto = new MakeMoveDto();
      primaryUserMoveDto.matchId = match.id;
      primaryUserMoveDto.userId = randomPrimaryUser.id;
      primaryUserMoveDto.move = primaryUserMove;
      await this.matchService.makeMove(primaryUserMoveDto);

      const secondaryUserMoveDto = new MakeMoveDto();
      secondaryUserMoveDto.matchId = match.id;
      secondaryUserMoveDto.userId = randomSecondaryUser.id;
      secondaryUserMoveDto.move = secondaryUserMove;
      await this.matchService.makeMove(secondaryUserMoveDto);

      console.log(
        `==== COUNT= ${i} match=${match.id} - ${randomPrimaryUser.id}:${primaryUserMove} - ${randomSecondaryUser.id}:${secondaryUserMove}`,
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
