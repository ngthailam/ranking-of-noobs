import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CONSTS } from 'src/core/const/constants';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, USER_TBL_KEYS } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = new User();
    user.name = createUserDto.name;
    return this.userRepo.save(user);
  }

  findAll() {
    return this.userRepo.find();
  }

  async findRandom() {
    const users: User[] = await this.userRepo.query(
      `SELECT * FROM ${USER_TBL_KEYS.tblName}`,
    );

    const randomIndex = this.getRandomArbitrary(0, users.length - 1);
    const randomUser: User = users[randomIndex];

    // console.log(`Randome index = ${randomIndex}`);

    return randomUser;
  }

  getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  async forceFindOneWithinRange(
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

    return this.forceFindOneWithinRange(userId, userElo, eloRange + 200);
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepo.update(
      {
        id: id,
      },
      {
        name: updateUserDto.name,
        matchCount: updateUserDto.matchCount,
      },
    );
  }

  async incrementMatchCount(id: string) {
    const user = await this.findOne(id);
    user.matchCount = user.matchCount + 1;
    return this.userRepo.save(user);
  }

  updateElo(user: User, eloChange: number) {
    const clonedUser = { ...user };
    clonedUser.elo = user.elo + eloChange;
    return this.userRepo.save(clonedUser);
  }

  remove(id: string) {
    return this.userRepo.delete({ id: id });
  }
}
