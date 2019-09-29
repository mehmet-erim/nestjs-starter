import * as bcrypt from 'bcryptjs';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Files } from '../files/files.entity';
import { BaseEntity } from '../shared';
import { Roles } from '../roles/roles.entity';

@Entity()
export class Users extends BaseEntity {
  @Column({ length: 100, unique: true })
  email!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ select: false })
  password: string;

  @Column('uuid', { nullable: true, select: false })
  fileId: string;

  @OneToOne(type => Files, files => files.user, {
    nullable: true,
    cascade: true,
  })
  @JoinColumn({ name: 'fileId' })
  file: Files;

  @ManyToMany(type => Roles)
  @JoinTable()
  roles: Roles[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string) {
    return bcrypt.compare(attempt, this.password);
  }

  avatar: string;
}
