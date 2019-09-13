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
import { ConfigService } from '../config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private userService: UsersService,
    private config: ConfigService,
  ) {}

  @Post('register')
  register(@Body() model: AuthDto.Register) {
    return this.authService.register(model);
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
    this.redirectToFront(req, res);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // initiates the google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req, @Res() res) {
    this.redirectToFront(req, res);
  }

  redirectToFront(req, res) {
    if (req.user) {
      res.redirect(
        `${this.config.get('SOCIAL_LOGIN_REDIRECT_URL')}/?token=${Buffer.from(
          JSON.stringify(req.user),
        ).toString('base64')}`,
      );
    } else {
      res.redirect(`${this.config.get('SOCIAL_LOGIN_REDIRECT_URL')}/?token=`);
    }
  }
}
