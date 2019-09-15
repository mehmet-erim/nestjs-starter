import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { AuthDto } from '../auth/auth.dto';
import { BaseCrudService } from '../shared';
import { UsersDto } from './users.dto';
import { Users } from './users.entity';

@Injectable()
export class UsersService extends BaseCrudService<
  Users,
  UsersDto.Create,
  UsersDto.Update
> {
  constructor(
    // private jwtService: JwtService,
    @InjectRepository(Users)
    protected userRepository: Repository<Users>,
  ) {
    super(userRepository);
  }

  async findMe(token: string) {
    token = token.split(' ')[1];
    const payload = jwt.decode(token) as AuthDto.JwtPayload;

    return this.findOne(payload.id);
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
