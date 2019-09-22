import * as bcrypt from 'bcryptjs';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Files } from '../files/files.entity';
import { BaseEntity } from '../shared';

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

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string) {
    return bcrypt.compare(attempt, this.password);
  }

  avatar: string;
}
