import {
  Controller,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Get('/random/rand/:id')
  async findRandom(@Param('id') id: string) {
    const vale = await this.userService.findOneWithinEloRange(id, 1000);
    // console.log(JSON.stringify(vale));
    return vale;
  }
}
