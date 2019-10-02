import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from 'src/auth/auth.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private userService: UsersService,
  ) {}

  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const payload: AuthDto.JwtPayload = request.user;

    return this.userService.findById(payload.id).then(user => {
      let found = false;

      roles.forEach(role => {
        if (found) {
          return true;
        }
        found = user.roles.findIndex(r => r.name === role) > -1;
      });
      return found;
    });
  }
}
