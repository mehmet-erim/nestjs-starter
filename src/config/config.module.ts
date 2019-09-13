import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(
        `${__dirname.slice(0, __dirname.lastIndexOf('/'))}/.env`,
      ),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
