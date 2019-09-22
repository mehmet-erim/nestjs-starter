import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { generatePassword, MESSAGES } from '../shared';
import { tokenSign } from '../shared/utils/token-utils';
import { UsersService } from '../users/users.service';
import { AuthDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login({
    email,
    password,
  }: AuthDto.Login): Promise<AuthDto.TokenResponse> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Username or password is invalid.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { id } = user;

    return tokenSign(this.jwtService, { id, email });
  }

  async register(model: AuthDto.Register): Promise<AuthDto.TokenResponse> {
    const { id } = await this.usersService.create(model);

    return tokenSign(this.jwtService, { id, email: model.email });
  }
}

export async function socialLoginValidate(
  usersService: UsersService,
  jwtService: JwtService,
  authService: AuthService,
  profile: any,
  done: Function,
) {
  try {
    // console.log(profile);
    const email = profile.emails[0].value;
    const name = profile.name.givenName + profile.name.familyName;

    if (!email) {
      done(
        null,
        new HttpException(MESSAGES.EMAIL_NOT_FOUND, HttpStatus.BAD_REQUEST),
      );
    }

    const user = await usersService.findOneByEmail(email);

    let token: AuthDto.TokenResponse;
    if (user) {
      token = tokenSign(jwtService, { id: user.id, email: user.email });
    } else {
      if (!name) {
        done(
          null,
          new HttpException(MESSAGES.NAME_NOT_FOUND, HttpStatus.BAD_REQUEST),
        );
      }

      token = await authService.register({
        email,
        name,
        password: generatePassword(),
      });
    }

    done(null, token);
  } catch (err) {
    console.error(err);
    throw new HttpException(MESSAGES.AN_ERROR_OCCURRED, HttpStatus.BAD_REQUEST);
  }
}
