import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { shortenRoutes } from './routes/shorten.routes';
import { redirectRoutes } from './routes/redirect.routes';
import { rateLimiter } from './middlewares/rateLimit.middleware';

const app: FastifyInstance = fastify({ logger: true });

app.register(cors, { origin: '*' });

// --- REGISTER MIDDLEWARE HERE ---
// Fastify uses 'addHook' for middlewares
app.addHook('onRequest', rateLimiter); 

app.register(shortenRoutes);
app.register(redirectRoutes);

app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date() };
});

export default app;