import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtAuthUser } from '../auth/jwt/jwt-extractor';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Should be removed in production
   * @returns 
   */
  @Get()
  getAll() {
    return this.userService.findAll();
  }

  /**
   * Should be removed in production
   * @returns 
   */
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile/self')
  getProfile(@JwtAuthUser() user: User) {
    return this.userService.findOne(user.id);
  }

  @UseGuards(JwtAuthGuard)
  deleteremove(@JwtAuthUser() user: User) {
    return this.userService.remove(user.id);
  }

  @Get('/random/rand/:id')
  async findRandom(@Param('id') id: string) {
    return this.userService.findOneWithinEloRange(id, 1000);
  }
}
