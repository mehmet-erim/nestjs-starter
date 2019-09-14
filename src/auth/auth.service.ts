import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config';
import { tokenSign } from '../shared/utils/token-utils';
import { UsersService } from '../users/users.service';
import { AuthDto } from './auth.dto';
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
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
