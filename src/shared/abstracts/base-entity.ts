import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ select: false, default: false })
  isDeleted: boolean;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @Column('uuid', { nullable: true, select: false })
  createdBy: string | null;

  @UpdateDateColumn({ nullable: true, select: false })
  updatedAt: Date;

  @Column('uuid', { nullable: true, select: false })
  updatedBy: string | null;
}
