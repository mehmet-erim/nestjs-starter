import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommonValidators } from '../shared';
import { UsersDto } from './users.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
@UseGuards(new AuthGuard())
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: CommonValidators.IdParamValidator) {
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() model: UsersDto.Create) {
    return this.userService.create(model);
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
