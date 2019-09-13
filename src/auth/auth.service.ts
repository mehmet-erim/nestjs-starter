import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { tokenSign } from '../shared/utils/token-utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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
