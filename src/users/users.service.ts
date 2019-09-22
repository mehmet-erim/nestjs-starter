import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fse from 'fs-extra';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { AuthDto } from '../auth/auth.dto';
import { ConfigService } from '../config';
import { MulterFile } from '../files/files';
import { Files } from '../files/files.entity';
import { BaseCrudService, MESSAGES } from '../shared';
import { UsersDto } from './users.dto';
import { Users } from './users.entity';

@Injectable()
export class UsersService extends BaseCrudService<
  Users,
  UsersDto.Create,
  UsersDto.Update
> {
  constructor(
    @InjectRepository(Users)
    protected userRepository: Repository<Users>,
    private config: ConfigService,
  ) {
    super(userRepository);
  }

  async findById(id: string): Promise<Users> {
    const user = await this.findOne(id, ['file']);

    if (user.file) {
      user.avatar = `${this.config.get('BACKEND_URL')}/users/avatar/${
        user.file.storageName
      }`;
    }

    delete user.file;
    return user;
  }

  async findMe(token: string) {
    token = token.split(' ')[1];
    const payload = jwt.decode(token) as AuthDto.JwtPayload;

    const user = await this.findOne(payload.id, ['file']);

    if (user.file) {
      user.avatar = `${this.config.get('BACKEND_URL')}/users/avatar/${
        user.file.storageName
      }`;
    }

    delete user.file;
    return user;
  }

  async findAll(): Promise<Users[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.file', 'file', 'file.isDeleted = :isDeleted', {
        isDeleted: false,
      })
      .where('user.isDeleted = :isDeleted', { isDeleted: false })
      .select(['user.id', 'user.name', 'user.email', 'file.storageName'])
      .getMany();

    return (users.map(user => ({
      ...user,
      avatar: user.file
        ? `${this.config.get('BACKEND_URL')}/users/avatar/${
            user.file.storageName
          }`
        : null,
      file: undefined,
    })) as any) as Users[];
  }

  async findOneByEmail(email: string): Promise<Users> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.file', 'file', 'file.isDeleted = :isDeleted', {
        isDeleted: false,
      })
      .where('user.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('user.email = :email', { email })
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.password',
        'file.storageName',
      ])
      .getOne();
  }

  async uploadAvatar(avatar: MulterFile, userId: string): Promise<Users> {
    let user = await this.findOne(userId, ['file']);

    if (!user) {
      fse.unlink(`${avatar.destination}/${avatar.filename}`);
      throw new BadRequestException(MESSAGES.USER_NOT_FOUND);
    } else if (user.file && user.file.storageName) {
      fse.unlink(`${avatar.destination}/${user.file.storageName}`);
    }

    const file = new Files();

    file.originalName = avatar.originalname;
    file.size = avatar.size;
    file.storageName = avatar.filename;
    user.file = file;

    this.userRepository.merge(user);

    return this.userRepository.save(user);
  }
}
