import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Match } from './entities/match.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,
  ) {}

  create(createMatchDto: CreateMatchDto) {
    const match = new Match();
    return this.matchRepo.save(match);
  }

  findAll() {
    return this.matchRepo.find();
  }

  async findOne(id: number) {
    const match = await this.matchRepo.findOne({
      where: { id: id },
    });

    if (match == null) {
      throw new HttpException(
        `Match with id=${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return match;
  }

  async update(id: number, updateMatchDto: UpdateMatchDto) {
    return this.matchRepo.update(
      {
        id: id,
      },
      {
        // TODO: fill this
      },
    );
  }

  remove(id: number) {
    return this.matchRepo.delete({ id: id });
  }
}
