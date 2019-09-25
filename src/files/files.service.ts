import {
  BadGatewayException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fse from 'fs-extra';
import { Repository } from 'typeorm';
import { Files } from './files.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(Files)
    protected repository: Repository<Files>,
  ) {}

  async delete(storageName: string) {
    try {
      const data = await this.repository.findOne({
        where: { isDeleted: false, storageName: storageName },
      });

      if (!data) {
        throw new HttpException('Record not found', HttpStatus.BAD_REQUEST);
      }

      data.isDeleted = true;
      await this.repository.save(data as Files);
      fse.unlink(`${data.destination}/${data.storageName}`);
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }
}
