import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMatchHistoryDto } from './dto/create-match-history.dto';
import { UpdateMatchHistoryDto } from './dto/update-match-history.dto';
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
}
