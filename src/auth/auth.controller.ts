import {
  Body,
  Controller,
  HttpCode,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

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

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin() {
    // initiates the facebook OAuth2 login flow
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  facebookLoginCallback(@Req() req, @Res() res) {
    // handles the facebook OAuth2 callback
    const jwt: string = req.user.jwt;
    if (jwt) res.redirect('http://localhost:4200/login/succes/' + jwt);
    else res.redirect('http://localhost:4200/login/failure');
  }
}
