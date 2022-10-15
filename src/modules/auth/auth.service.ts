import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterRequest } from './dto/register.request';
import { LoginRequest } from './dto/login.request';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginRequest) {
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
      accessToken: this.jwtService.sign(payload),
    };
  }

  register(registerDto: RegisterRequest) {
    const createUserDto = new CreateUserDto();
    createUserDto.name = registerDto.name;
    return this.userService.create(createUserDto);
  }
}
