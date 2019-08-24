import { Column, Entity, BeforeInsert } from 'typeorm';
import { BaseEntity } from '../shared';
import * as bcrypt from 'bcryptjs';

@Entity()
export class Users extends BaseEntity {
  @Column({ length: 100, unique: true })
  email!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ select: false })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string) {
    return bcrypt.compare(attempt, this.password);
  }
}
