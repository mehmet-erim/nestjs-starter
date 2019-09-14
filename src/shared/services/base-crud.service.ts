import {
  Injectable,
  HttpException,
  HttpStatus,
  BadGatewayException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Common } from '../models';
import { MESSAGES } from '../constants';
import { BaseEntity } from '../abstracts';

@Injectable()
export class BaseCrudService<T extends BaseEntity, C = any, U = any> {
  constructor(protected repository: Repository<T>) {}

  findOne(id: string, relations?: string[]): Promise<T> {
    return this.repository.findOne(id, {
      relations,
      where: { isDeleted: false },
    });
  }

  findAll(): Promise<T[]> {
    return this.repository.find({ where: { isDeleted: false } });
  }

  async create(model: C): Promise<Common.Result> {
    try {
      const data = this.repository.create();
      this.repository.merge(data, model);

      const { id } = await this.repository.save(data as any);

      return { id, message: MESSAGES.SUCCESS } as Common.Result;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async update(id: string, model: U): Promise<Common.Result> {
    try {
      const data = await this.repository.findOne(id);

      if (!data) {
        throw new HttpException('Record not found', HttpStatus.BAD_REQUEST);
      }

      this.repository.merge(data, model);

      this.repository.save(data as any);

      return { id, message: MESSAGES.SUCCESS } as Common.Result;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }

  async delete(id: string): Promise<Common.Result> {
    try {
      const data = await this.repository.findOne(id, {
        where: { isDeleted: false },
      });

      if (!data) {
        throw new HttpException('Record not found', HttpStatus.BAD_REQUEST);
      }

      data.isDeleted = true;
      this.repository.save(data as any);

      return { id, message: MESSAGES.SUCCESS } as Common.Result;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }
}
