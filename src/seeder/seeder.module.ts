import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [UsersModule, RolesModule],
  providers: [SeederService],
})
export class SeederModule {}
