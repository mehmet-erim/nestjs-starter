import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('register')
  register(@Body() model: AuthDto.Register) {
    return this.userService.create(model as any);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() model: AuthDto.Login) {
    return this.authService.login(model);
  }
}
