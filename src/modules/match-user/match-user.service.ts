import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  findAllByMatchId(matchId: string) {
    return this.matchUserRepo.find({
      where: {
        matchId: matchId,
      },
    });
  }

  deleteAllByMatchId(matchId: string) {
    return this.matchUserRepo.delete({
      matchId: matchId,
    });
  }
}
