import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../shared';
import { Users } from '../users/users.entity';

@Entity()
export class Files extends BaseEntity {
  @Column()
  originalName!: string;

  @Column()
  storageName: string;

  @Column({ type: 'numeric' })
  size: number;

  @OneToOne(type => Users, users => users.file)
  user: Users;
}
