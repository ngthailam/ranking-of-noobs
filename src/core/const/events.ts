import { ValidMove } from 'src/modules/match/dto/make-move.dto';
import { MatchResult } from 'src/modules/match/entities/match.entity';

export const EVENTS_KEY = {
  makeMove: 'makeMove',
  matchResult: 'matchResult',
  matchInitiated: 'matchInitiated', // When both user joined the match
};

export class MatchInitiatedEvent {
  constructor(matchId: string) {
    this.matchId = matchId;
  }

  matchId: string;
}

export class MakeMoveEvent {
  constructor(matchId: string, userId: string, move: ValidMove) {
    this.matchId = matchId;
    this.userId = userId;
    this.move = move;
  }

  matchId: string;

  userId: string;

  move: ValidMove;
}

export class MatchResultEvent {
  constructor(
    matchId: string,
    primaryUserId: string,
    primaryUserMove: ValidMove,
    secondaryUserId: string,
    secondaryUserMove: ValidMove,
    result: MatchResult,
  ) {
    this.matchId = matchId;
    this.primaryUserId = primaryUserId;
    this.primaryUserMove = primaryUserMove;
    this.secondaryUserId = secondaryUserId;
    this.secondaryUserMove = secondaryUserMove;
    this.result = result;
  }

  matchId: string;

  primaryUserId: string;

  primaryUserMove: ValidMove;

  secondaryUserId: string;

  secondaryUserMove: ValidMove;

  result: MatchResult;
}
