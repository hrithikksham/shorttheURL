// src/controllers/redirect.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { UrlService } from '../services/url.service';

export const redirectUrl = async (req: FastifyRequest<{ Params: { code: string } }>, reply: FastifyReply) => {
  const { code } = req.params;

  try {
    const longUrl = await UrlService.getOriginalUrl(code);

    if (longUrl) {
      // 302 Found (Temporary Redirect) - better for analytics than 301
      return reply.redirect(longUrl);
    } else {
      return reply.status(404).send({ error: 'URL not found' });
    }
  } catch (error) {
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
};