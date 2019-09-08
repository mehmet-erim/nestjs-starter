import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: AuthDto.Login): Promise<AuthDto.Response> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Username or password is invalid.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { id } = user;

    return {
      accessToken: this.jwtService.sign({ id, email } as AuthDto.JwtPayload),
      tokenType: 'baerer',
      expiresIn: new Date(new Date().valueOf() + jwtConstants.expiresIn),
    };
  }

  async register(model: AuthDto.Register): Promise<AuthDto.Response> {
    const { id } = await this.usersService.create(model);

    return {
      accessToken: this.jwtService.sign({
        id,
        email: model.email,
      } as AuthDto.JwtPayload),
      tokenType: 'baerer',
      expiresIn: new Date(new Date().valueOf() + jwtConstants.expiresIn),
    };
  }
}
