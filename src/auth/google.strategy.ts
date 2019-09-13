import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '../config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { tokenSign, generatePassword } from '../shared/utils';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './auth.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private config: ConfigService,
    private authService: AuthService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID'),
      clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${config.get('BACKEND_URL')}/auth/google/callback`,
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile,
    done: Function,
  ) {
    try {
      const email = profile.emails[0].value;
      const name = profile.name.givenName + profile.name.familyName;

      const user = await this.usersService.findOneByEmail(email);

      let token: AuthDto.TokenResponse;
      if (user) {
        token = tokenSign(this.jwtService, { id: user.id, email: user.email });
      } else {
        token = await this.authService.register({
          email,
          name,
          password: generatePassword(),
        });
      }

      done(null, token);
    } catch (err) {
      console.log(err);
      done(err, false);
    }
  }
}
