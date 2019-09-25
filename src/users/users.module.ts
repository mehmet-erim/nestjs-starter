import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { Users } from './users.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { ConfigModule } from '../config/config.module';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), ConfigModule, FilesModule],
  providers: [UsersService, UsersResolver],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
