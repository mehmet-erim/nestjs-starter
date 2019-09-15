import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() model: AuthDto.Register) {
    return this.authService.register(model);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() model: AuthDto.Login) {
    return this.authService.login(model);
  }

  @Post('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin(@Req() req) {
    return req.user;
  }

  @Post('google')
  @UseGuards(AuthGuard('google'))
  googleLogin(@Req() req) {
    return req.user;
  }
}
