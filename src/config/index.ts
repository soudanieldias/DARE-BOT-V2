import dotenv from 'dotenv';

dotenv.config();

const config = {
  token: process.env.DISCORD_TOKEN,
  prefix: process.env.PREFIX || '//',
  ownerId: process.env.OWNER_ID,
  databaseUrl: process.env.DATABASE_URL,
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  logLevel: process.env.LOG_LEVEL || 'info',
  apiUrl: process.env.API_URL || 'http://localhost:3000/api',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
};

export default config;
