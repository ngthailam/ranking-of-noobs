import { Controller, Post, Body, Param, Res, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequest } from './dto/login.request';
import { RegisterRequest } from './dto/register.request';
@ApiTags('auth')

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginRequest) {
    return this.authService.login(loginDto);
  }

  @Post('/register')
  register(@Body() registerDto: RegisterRequest) {
    return this.authService.register(registerDto);
  }

  @Post('/register/:count')
  async createByNum(@Param('count') count: string) {
    for (let i = 0; i < +count; i++) {
      const registerDto = new RegisterRequest();
      registerDto.name = `Lam xx ${i}`;
      await this.register(registerDto);
    }
    return 'DONE';
  }
}
