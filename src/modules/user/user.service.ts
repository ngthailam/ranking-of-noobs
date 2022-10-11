import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async findRandom(excludedId: string) {
    return this.userRepo.query(
      `SELECT * FROM ${USER_TBL_KEYS.tblName} WHERE ${USER_TBL_KEYS.id} != '${excludedId}' ORDER BY RANDOM() LIMIT 1`,
    );
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
      },
    );
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
