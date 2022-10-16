import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CONSTS } from 'src/core/const/constants';
import { randomInt } from 'src/core/utils/random';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserResultDto } from './dto/update-user-result.dto';
import {
  User,
  UserRankCalculator,
  USER_TBL_KEYS,
} from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getSortByElo(
    order: 'ASC' | 'DESC' = 'DESC',
    limit: number = CONSTS.defaultUserLimit,
  ) {
    return this.userRepo 
    .createQueryBuilder(USER_TBL_KEYS.tblName)
    .orderBy(`${USER_TBL_KEYS.tblName}.${USER_TBL_KEYS.elo}`, order)
    .limit(limit)
    .getMany();
  }

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.name = createUserDto.name;

    // TODO: maybe name already unique => catch db exception instead
    if (await this.findOneByName(createUserDto.name)) {
      throw new HttpException(
        `User with name = ${createUserDto.name} already exists`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    return this.userRepo.save(user);
  }

  findOneByName(username: string) {
    return this.userRepo.findOne({ where: { name: username } });
  }

  findAll() {
    return this.userRepo.find();
  }

  async findRandom() {
    const users: User[] = await this.userRepo.find();

    const randomIndex = randomInt(0, users.length);
    const randomUser: User = users[randomIndex];

    return randomUser;
  }

  async findRandomExclude(excludedId: string) {
    const users: User[] = await this.userRepo.query(
      `SELECT * FROM ${USER_TBL_KEYS.tblName} WHERE ${USER_TBL_KEYS.id} != '${excludedId}'`,
    );

    const randomIndex = randomInt(0, users.length);
    const randomUser: User = users[randomIndex];

    return randomUser;
  }

  async forceFindOneWithinEloRange(
    userId: string,
    userElo: number,
    eloRange: number = CONSTS.findOpponentEloRange,
  ) {
    if (eloRange > 2000) {
      return undefined;
    }

    const user = await this.findOneWithinEloRange(userId, userElo, eloRange);
    if (user) {
      return user;
    }

    return this.forceFindOneWithinEloRange(userId, userElo, eloRange + 200);
  }

  async findOneWithinEloRange(
    userId: string,
    elo: number,
    eloRange: number = CONSTS.findOpponentEloRange,
  ) {
    const listUsers: User[] = await this.userRepo.query(
      `SELECT * FROM ${USER_TBL_KEYS.tblName} 
      WHERE 
        ${USER_TBL_KEYS.id} != '${userId}'
        AND ${USER_TBL_KEYS.elo} > ${elo - eloRange} 
        AND ${USER_TBL_KEYS.elo} <= ${elo + eloRange} 
      ORDER BY RANDOM() LIMIT 1`,
    );
    return listUsers[0];
  }

  async findOne(id: string) {
    if (!id) {
      throw new HttpException(
        `user service findOne id is not valid, id=${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    const user = await this.userRepo.findOne({
      where: { id: id },
    });

    if (user == null) {
      throw new HttpException(
        `User with id=${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  updateResult(id: string, updateUserDto: UpdateUserResultDto) {
    return this.userRepo.update(
      {
        id: id,
      },
      {
        elo: updateUserDto.elo,
        matchCount: updateUserDto.matchCount,
      },
    );
  }

  async updateAllUsersRank() {
    const allUsers: User[] = await this.findAll();
    allUsers.forEach((element) => {
      element.rank = UserRankCalculator.calculate(element.elo);
      this.userRepo.save(element);
    });
  }

  remove(id: string) {
    return this.userRepo.delete({ id: id });
  }
}
