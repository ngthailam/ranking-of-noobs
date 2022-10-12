import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidMove } from '../match/dto/make-move.dto';
import { MatchUser } from './entities/match-user';

@Injectable()
export class MatchUserService {
  constructor(
    @InjectRepository(MatchUser)
    private readonly matchUserRepo: Repository<MatchUser>,
  ) {}

  create(matchUser: MatchUser) {
    return this.matchUserRepo.save(matchUser);
  }

  findOneByUserId(userId: string) {
    return this.matchUserRepo.findOne({
      where: {
        userId: userId,
      },
    });
  }

  findOneByUserIdAndMatchId(userId: string, matchId: string) {
    return this.matchUserRepo.findOne({
      where: {
        userId: userId,
        matchId: matchId,
      },
    });
  }

  findAllByMatchId(matchId: string) {
    return this.matchUserRepo.find({
      where: {
        matchId: matchId,
      },
    });
  }

  makeMove(userId: string, matchId: string, move: ValidMove) {
    return this.matchUserRepo.update(
      {
        matchId: matchId,
        userId: userId,
      },
      {
        move: move,
      },
    );
  }

  deleteAllByMatchId(matchId: string) {
    return this.matchUserRepo.delete({
      matchId: matchId,
    });
  }
}
