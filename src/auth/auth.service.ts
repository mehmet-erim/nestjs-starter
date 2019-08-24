import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthDto } from './auth.dto';
import { tokenSign } from '../shared/utils';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async login({ email, password }: AuthDto.Login): Promise<{ token: string }> {
    const user = await this.userService.findOneByEmail(email);

    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Username or password is invalid.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return { token: tokenSign(user.id, user.email) };
  }

  async register(model: AuthDto.Register): Promise<{ token: string }> {
    const { id } = await this.userService.create(model);

    return { token: tokenSign(id, model.email) };
  }
}
