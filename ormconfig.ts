import typeormConfig from './src/typeorm-config';

const PROD = true;

const BASE_DIR = PROD ? 'dist' : 'src';

export = {
  ...typeormConfig,
  entities: [BASE_DIR + '/**/**.entity{.ts,.js}'],
  migrations: [BASE_DIR + '/migrations/*{.ts,.js}'],
  logging: PROD ? false : true,
  cli: {
    migrationsDir: BASE_DIR + '/migrations',
  },
};
