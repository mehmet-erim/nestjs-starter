import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../shared';
import { Users } from './users.entity';
import { UsersDto } from './users.dto';

@Injectable()
export class UsersService extends BaseCrudService<
  Users,
  UsersDto.Create,
  UsersDto.Update
> {
  constructor(
    @InjectRepository(Users) protected userRepository: Repository<Users>,
  ) {
    super(userRepository);
  }

  async findAll(): Promise<Users[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.isDeleted = :isDeleted', { isDeleted: false })
      .select(['user.id', 'user.name', 'user.email'])
      .getMany();
  }

  async findOneByEmail(email: string): Promise<Users> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('user.email = :email', { email })
      .select(['user.id', 'user.name', 'user.email', 'user.password'])
      .getOne();
  }
}
