import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from '../roles/roles.entity';
import { Users } from '../users/users.entity';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Users) private usersRepo: Repository<Users>,
    @InjectRepository(Roles) private rolesRepo: Repository<Roles>,
  ) {
    this.seed();
  }

  async seed() {
    let admin = await this.rolesRepo.findOne({
      where: { isDeleted: false, name: 'adamin' },
    });

    if (!admin) {
      const insertResult = await this.rolesRepo.insert({ name: 'adamin' });
      admin = insertResult.generatedMaps[0] as Roles;
    }

    let adminUser = await this.usersRepo.findOne({
      where: { isDeleted: false, email: 'info2@mehmeterim.com' },
    });

    if (!adminUser) {
      const model = {
        name: 'admin',
        email: 'info2@mehmeterim.com',
        password: 'test1234',
        roles: [admin],
      } as Users;
      const user = this.usersRepo.create();
      this.usersRepo.merge(user, model);
      adminUser = (await this.usersRepo.save(user)) as Users;
    }
  }
}
