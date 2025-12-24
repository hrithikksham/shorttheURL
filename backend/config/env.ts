// src/config/env.ts
import * as dotenv from 'dotenv';
import { url } from 'node:inspector';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  db: {
    url: process.env.DATABASE_URL
  },
  redis: {
    url: process.env.REDIS_URL,
    host : process.env.REDIS_HOST,
    port : process.env.REDIS_PORT,
    password : process.env.REDIS_PASSWORD
  },
  app: {
    baseUrl: process.env.BASE_URL || "https://shorttheurl-qawf.onrender.com"
  }
};