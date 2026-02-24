import 'reflect-metadata';
import { DataSource } from 'typeorm';
import 'dotenv/config';
import { Guild, User, Member, GuildSettings } from './entities';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USER ?? '',
  password: process.env.DATABASE_PASSWORD ?? '',
  database: process.env.DATABASE_NAME ?? 'dare_bot',
  url: process.env.DATABASE_URL,
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.DATABASE_LOGGING === 'true',
  entities: [Guild, User, Member, GuildSettings],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
  extra: { connectTimeout: 10_000 },
});
