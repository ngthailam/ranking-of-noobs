import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UserService } from '../user/user.service';
import { randomInt } from 'src/core/utils/random';
import { MakeMoveDto, ValidMove } from './dto/make-move.dto';
import { SimulateFixedDto } from './dto/simulate-fixed.dto';
import { MatchHistoryService } from '../match-history/match-history.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { CreateMatchRequest } from './dto/request/create-match.request';
import { JwtAuthUser } from '../auth/jwt/jwt-extractor';
import { User } from '../user/entities/user.entity';
import { MakeMoveRequest } from './dto/request/make-move.request';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('match')

@Controller('match')
export class MatchController {
  constructor(
    private readonly matchService: MatchService,
    private readonly matchHistoryService: MatchHistoryService,
    private readonly userService: UserService,
  ) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  createMatch(
    @JwtAuthUser() user: User,
    @Body() createMatchRequest: CreateMatchRequest,
  ) {
    const createMatchDto = new CreateMatchDto();
    createMatchDto.opponentId = createMatchRequest.opponentId;
    createMatchDto.userId = user.id;
    return this.matchService.createMatch(createMatchDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/make-move')
  makeMove(
    @JwtAuthUser() user: User,
    @Body() makeMoveRequest: MakeMoveRequest,
  ) {
    const makeMoveDto = new MakeMoveDto();
    makeMoveDto.matchId = makeMoveRequest.matchId;
    makeMoveDto.move = makeMoveRequest.move;
    makeMoveDto.userId = user.id;
    return this.matchService.makeMove(makeMoveDto);
  }

  @UseGuards(JwtAuthGuard)

  @Post('/seen-result/:matchId')
  setSeenResult(@JwtAuthUser() user: User, @Param('matchId') matchId: string) {
    return this.matchService.setSeenResult(user.id, matchId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.matchService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/ongoing')
  getByUserId(@JwtAuthUser() user: User) {
    const uid = user.id;
    return this.matchService.findAllByUserId(uid);
  }

  /**
   * This is only for testing
   * @returns
   */
  @Get()
  getAll() {
    return this.matchService.findAll();
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
    createMatchDto.opponentId = fixedDto.secondaryUserId;
    createMatchDto.userId = fixedDto.primaryUserId;
    const match = await this.matchService.createMatch(createMatchDto);

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
