import typeormConfig from './src/typeorm-config';

const PROD = false;

const BASE_DIR = PROD ? 'dist' : 'src';

export = {
  ...typeormConfig,
  entities: [BASE_DIR + '/**/**.entity{.ts,.js}'],
  migrations: [BASE_DIR + '/migrations/*{.ts,.js}'],
  logging: PROD ? false : ['query', 'error'],
  cli: {
    migrationsDir: BASE_DIR + '/migrations',
  },
};
