import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { shortenRoutes } from './routes/shorten.routes';
import { redirectRoutes } from './routes/redirect.routes';
import { rateLimiter } from './middlewares/rateLimit.middleware';
import { analyticsRoutes } from './routes/analytics.routes';
const app: FastifyInstance = fastify({ logger: true });

app.register(cors, {
  origin: [
    'http://localhost:5173',                  // Local Development
    'https://makeitshort-ten.vercel.app/'   // <-- ADD YOUR VERCEL DOMAIN HERE
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
});

// --- REGISTER MIDDLEWARE HERE ---
// Fastify uses 'addHook' for middlewares
app.addHook('onRequest', rateLimiter); 

app.register(shortenRoutes);
app.register(redirectRoutes);
app.register(analyticsRoutes);

app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date() };
});

export default app;