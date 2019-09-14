import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import * as FacebookTokenStrategy from 'passport-facebook-token';
import { ConfigService } from '../config';
import { UsersService } from '../users/users.service';
import { AuthService, socialLoginValidate } from './auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(
  FacebookTokenStrategy,
  'facebook',
) {
  constructor(
    private config: ConfigService,
    private authService: AuthService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    super({
      clientID: config.get('FACEBOOK_CLIENT_ID'),
      clientSecret: config.get('FACEBOOK_CLIENT_SECRET'),
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
