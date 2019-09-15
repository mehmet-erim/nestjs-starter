import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommonValidators } from '../shared';
import { UsersDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  findMe(@Headers('authorization') token: string) {
    return this.userService.findMe(token);
  }

  @Post()
  create(@Body() model: UsersDto.Create) {
    return this.userService.create(model);
  }

  @Get(':id')
  findOne(@Param() { id }: CommonValidators.IdParamValidator) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  update(
    @Param() { id }: CommonValidators.IdParamValidator,
    @Body() model: UsersDto.Update,
  ) {
    return this.userService.update(id, model);
  }

  @Delete(':id')
  delete(@Param() { id }: CommonValidators.IdParamValidator) {
    return this.userService.delete(id);
  }
}
