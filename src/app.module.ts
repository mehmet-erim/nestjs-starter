import { Module, CacheInterceptor, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { LoggingInterceptor, HttpErrorFilter } from './shared';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'nestjs',
      synchronize: false,
      entities: [__dirname + '/**/**.entity{.ts,.js}'],
    }),
    GraphQLModule.forRoot({
      debug: false,
      playground: true,
      typePaths: [__dirname + '/**/*.graphql'],
      context: ({ req }) => ({ headers: req.headers }),
    }),

    // Modules
    UsersModule,
    AuthModule,
    ConfigModule,
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
