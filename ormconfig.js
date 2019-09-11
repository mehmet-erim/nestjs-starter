const PROD = true;

const BASE_DIR = PROD ? 'dist' : 'src';

module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'nestjs',
  synchronize: false,
  entities: [BASE_DIR + '/**/**.entity{.ts,.js}'],
  migrations: [BASE_DIR + '/migrations/*{.ts,.js}'],
  logging: PROD ? false : true,
  cli: {
    migrationsDir: BASE_DIR + '/migrations',
  },
};
