// src/app.ts
import fastify from 'fastify';
import cors from '@fastify/cors';
import { shortenRoutes } from './routes/shorten.routes';
import { redirectRoutes } from './routes/redirect.routes';

const app = fastify({ logger: true });

// Middlewares
app.register(cors, { origin: '*' });

// Routes registration
app.register(shortenRoutes);
app.register(redirectRoutes);

export default app;