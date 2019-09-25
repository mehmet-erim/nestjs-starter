import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from './files.service';
import { Files } from './files.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Files])],
  providers: [FilesService],
  controllers: [],
  exports: [FilesService],
})
export class FilesModule {}
