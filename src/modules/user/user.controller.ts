import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
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

  @Post('/create/:count')
  async createByNum(@Param('count') count: string) {
    for (let i = 0; i < +count; i++) {
      const createUserDto = new CreateUserDto();
      createUserDto.name = 'Lam ' + i;
      await this.userService.create(createUserDto);
    }
    return 'DONE';
  }
}
