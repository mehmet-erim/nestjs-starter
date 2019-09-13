import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { ConfigService } from '../config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private config: ConfigService) {
    super({
      clientID: config.get('FACEBOOK_CLIENT_ID'),
      clientSecret: config.get('FACEBOOK_CLIENT_SECRET'),
      callbackURL: `${config.get('BACKEND_URL')}/auth/facebook/callback`,
    });
  }

  async validate(accessToken, refreshToken, profile, done) {
    try {
      console.log(profile);

      const jwt: string = 'placeholderJWT';
      const user = {
        jwt,
      };

      done(null, user);
    } catch (err) {
      // console.log(err)
      done(err, false);
    }
  }
}
