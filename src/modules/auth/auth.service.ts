import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByName(loginDto.name);

    if (!user) {
      throw new HttpException(
        `User with name=${loginDto.name} does not exist`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = {
      uid: user.id,
      name: user.name,
      elo: user.elo,
      matchCount: user.matchCount,
      rank: user.rank,
    };

    return {
      uid: user.id,
      access_token: this.jwtService.sign(payload),
    };
  }

  register(registerDto: RegisterDto) {
    const createUserDto = new CreateUserDto();
    createUserDto.name = registerDto.name;
    return this.userService.create(createUserDto);
  }
}
