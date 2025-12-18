// src/server.ts
import app from './app';
import { config } from '../config/env';

const start = async () => {
  try {
    await app.listen({ port: Number(config.port), host: '0.0.0.0' });
    console.log(`🚀 Server running on http://localhost:${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();