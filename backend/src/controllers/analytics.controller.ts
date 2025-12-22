import { FastifyRequest, FastifyReply } from 'fastify';
import { AnalyticsService } from '../services/analytics.service';

export const getUrlStats = async (req: FastifyRequest<{ Params: { code: string } }>, reply: FastifyReply) => {
  const { code } = req.params;
  try {
    const stats = await AnalyticsService.getUrlStats(code);
    return reply.send(stats);
  } catch (error) {
    return reply.status(500).send({ error: 'Failed to fetch stats' });
  }
};