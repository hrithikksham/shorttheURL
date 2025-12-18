// src/controllers/shorten.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { UrlService } from '../services/url.service';
import { z } from 'zod'; // Assuming Zod for validation

export const shortenUrl = async (req: FastifyRequest, reply: FastifyReply) => {
  // Input Validation
  const bodySchema = z.object({
    longUrl: z.string().url(),
  });

  try {
    const { longUrl } = bodySchema.parse(req.body);
    
    const shortUrl = await UrlService.shorten(longUrl);
    
    return reply.status(201).send({ shortUrl });
  } catch (error) {
    return reply.status(400).send({ error: 'Invalid URL or Server Error' });
  }
};