import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../shared';

@Entity()
export class Roles extends BaseEntity {
  @Column()
  id!: string;

  @Column()
  name: string;
}
