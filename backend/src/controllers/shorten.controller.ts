// src/controllers/shorten.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { UrlService } from '../services/url.service';

export const shortenUrl = async (req: FastifyRequest, reply: FastifyReply) => {
  const body = req.body as { originalUrl?: string; longUrl?: string; customAlias?: string };
  const urlToShorten = body.originalUrl || body.longUrl;
  const customAlias = body.customAlias || "";
  if (!urlToShorten) {
    return reply.status(400).send({ error: 'Missing originalUrl or longUrl' });
  }

  try {
    // 1. Get the result from the service (which might be a full URL like "http://.../abc")
    const result = await UrlService.shorten(urlToShorten, body.customAlias);

    // 2. SMART FIX: If result is a full URL, split it and take the last part
    // This ensures we always send just the code "abc" or "j"
    const code = result.includes('/') ? result.split('/').pop() : result;

    return reply.status(201).send({ 
      success: true,
      shortCode: code, // Now this is guaranteed to be just the code
      originalUrl: urlToShorten
    });

  } catch (error: any) {
    console.error('Shorten Error:', error);
    if (error.message === 'Alias already in use') {
      return reply.status(409).send({ error: 'Custom alias is already taken.' });
    }
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
};