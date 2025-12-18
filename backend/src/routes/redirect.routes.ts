import { FastifyInstance } from 'fastify';
import { redirectUrl } from '../controllers/redirect.controller';

export async function redirectRoutes(fastify: FastifyInstance) {
  fastify.get('/:code', redirectUrl);
}