import { FastifyInstance } from 'fastify';
import { shortenUrl } from '../controllers/shorten.controller';

export async function shortenRoutes(fastify: FastifyInstance) {
  fastify.post('/api/shorten', shortenUrl);
}