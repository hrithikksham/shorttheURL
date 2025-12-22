// src/controllers/shorten.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { UrlService } from '../services/url.service';
import { z } from 'zod'; // Assuming Zod for validation

export const shortenUrl = async (req: FastifyRequest<{ Body: { longUrl: string; customAlias?: string } }>, reply: FastifyReply) => {
  const { longUrl, customAlias } = req.body;

  try {
    const shortUrl = await UrlService.shorten(longUrl);
    return reply.status(201).send({ shortUrl });
  } catch (error: any) {
    if (error.message === 'Alias already in use') {
      return reply.status(409).send({ error: 'Custom alias is already taken.' });
    }
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
};