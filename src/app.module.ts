import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { EventsModule } from './events/events.module';
import { FilesModule } from './files/files.module';
import { RolesModule } from './roles/roles.module';
import { SeederModule } from './seeder/seeder.module';
import { HttpErrorFilter, LoggingInterceptor } from './shared';
import typeormConfig from './typeorm-config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forRoot({
      ...typeormConfig,
      entities: [__dirname + '/**/**.entity{.ts,.js}'],
      logging: ['query', 'error'],
    } as TypeOrmModuleOptions),
    GraphQLModule.forRoot({
      debug: false,
      playground: true,
      typePaths: [__dirname + '/**/*.graphql'],
      context: ({ req }) => ({ headers: req.headers }),
    }),

    // Modules
    ConfigModule,
    UsersModule,
    FilesModule,
    AuthModule,
    EventsModule,
    RolesModule,
    SeederModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
