// src/config/env.ts
import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  db: {
    url: process.env.DATABASE_URL
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379
  },
  app: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  }
};