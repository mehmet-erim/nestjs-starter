import { Resolver, Query, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Resolver('User')
@UseGuards(AuthGuard('jwt'))
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query()
  users() {
    return this.userService.findAll();
  }

  @Query()
  user(@Args('id') id: string) {
    return this.userService.findOne(id);
  }
}
