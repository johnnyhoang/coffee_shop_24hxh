import common from './ormconfig.common';

const config = {
  ...common,
  seeds: ['src/database/seeds/*.seed.ts'],
  entities: [
    'src/modules/**/*.entity{.ts,.js}',
    'src/modules/**/entity/*.entity{.ts,.js}',
  ],
  migrations: ['src/database/migrations/mysql/*{.ts,.js}'], // Changed path to reflect MySQL
  logging: false,
};

export default config;
