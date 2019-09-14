import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as GooglePlusTokenStrategy from 'passport-google-plus-token';
import { ConfigService } from '../config';
import { AuthService, socialLoginValidate } from './auth.service';
import { UsersService } from '../users/users.service';
import { tokenSign, generatePassword } from '../shared/utils';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './auth.dto';
import { MESSAGES } from '../shared';

@Injectable()
export class GooglePlusStrategy extends PassportStrategy(
  GooglePlusTokenStrategy,
  'google',
) {
  constructor(
    private config: ConfigService,
    private authService: AuthService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID'),
      clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function,
  ) {
    await socialLoginValidate(
      this.usersService,
      this.jwtService,
      this.authService,
      profile,
      done,
    );
  }
}
