import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../shared';
import { RolesDto } from './roles.dto';
import { Roles } from './roles.entity';

@Injectable()
export class RolesService extends BaseCrudService<
  Roles,
  RolesDto.Create,
  RolesDto.Update
> {
  constructor(
    @InjectRepository(Roles)
    protected rolesRepository: Repository<Roles>,
  ) {
    super(rolesRepository);
  }
}
