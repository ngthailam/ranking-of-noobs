import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';
import { MatchHistory } from './entities/match-history.entity';

@Injectable()
export class MatchHistoryService {
  constructor(
    @InjectRepository(MatchHistory)
    private readonly matchHistoryRepo: Repository<MatchHistory>,
  ) {}

  create(createMatchHistoryDto: CreateMatchHistoryDto) {
    const matchHistory = new MatchHistory();
    matchHistory.id = createMatchHistoryDto.id;
    matchHistory.matchDate = createMatchHistoryDto.matchDate;
    matchHistory.primaryUserId = createMatchHistoryDto.primaryUserId;
    matchHistory.primaryUserMove = createMatchHistoryDto.primaryUserMove;
    matchHistory.secondaryUserId = createMatchHistoryDto.secondaryUserId;
    matchHistory.secondaryUserMove = createMatchHistoryDto.secondaryUserMove;
    matchHistory.result = createMatchHistoryDto.result;
    matchHistory.primaryUserEloBefore =
      createMatchHistoryDto.primaryUserEloBefore;
    matchHistory.primaryUserEloAfter =
      createMatchHistoryDto.primaryUserEloAfter;
    matchHistory.primaryUserEloChange =
      createMatchHistoryDto.primaryUserEloChange;
    matchHistory.secondaryUserEloBefore =
      createMatchHistoryDto.secondaryUserEloBefore;
    matchHistory.secondaryUserEloAfter =
      createMatchHistoryDto.secondaryUserEloAfter;
    matchHistory.secondaryUserEloChange =
      createMatchHistoryDto.secondaryUserEloChange;
    return this.matchHistoryRepo.save(matchHistory);
  }

  findAll() {
    return this.matchHistoryRepo.find();
  }

  findOne(id: string) {
    return this.matchHistoryRepo.findOne({
      where: { id: id },
    });
  }

  findAllByUserIdLimitOffset(userId: string, limit: number, offset: number) {
    return this.matchHistoryRepo.find({
      where: [
        {
          primaryUserId: userId,
        },
        {
          secondaryUserId: userId,
        },
      ],
      skip: offset,
      take: limit,
    });
  }
}
