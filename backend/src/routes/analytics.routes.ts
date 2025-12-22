import { FastifyInstance } from 'fastify';
import { getUrlStats } from '../controllers/analytics.controller';

export async function analyticsRoutes(fastify: FastifyInstance) {
  fastify.get('/api/analytics/:code', getUrlStats);
}