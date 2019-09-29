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
import { AuthGuard } from '@nestjs/passport';
import { CommonValidators } from '../shared';
import { RolesDto } from './roles.dto';
import { RolesService } from './roles.service';

@Controller('roles')
@UseGuards(AuthGuard('jwt'))
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Post()
  create(@Body() model: RolesDto.Create) {
    return this.rolesService.create(model);
  }

  @Get(':id')
  findOne(@Param() { id }: CommonValidators.IdParamValidator) {
    return this.rolesService.findOne(id);
  }

  @Put(':id')
  update(
    @Param() { id }: CommonValidators.IdParamValidator,
    @Body() model: RolesDto.Update,
  ) {
    return this.rolesService.update(id, model);
  }

  @Delete(':id')
  delete(@Param() { id }: CommonValidators.IdParamValidator) {
    return this.rolesService.delete(id);
  }
}
