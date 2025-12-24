// src/controllers/shorten.controller.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { UrlService } from '../services/url.service';

export const shortenUrl = async (req: FastifyRequest, reply: FastifyReply) => {
  // 1. FIX INPUT: Accept 'originalUrl' (matches Frontend) OR 'longUrl' (matches Postman/tests)
  const body = req.body as { originalUrl?: string; longUrl?: string; customAlias?: string };
  const urlToShorten = body.originalUrl || body.longUrl;

  if (!urlToShorten) {
    return reply.status(400).send({ error: 'Missing originalUrl or longUrl' });
  }

  try {
    // 2. Call Service
    // (Assuming UrlService.shorten returns just the code like "abc12". 
    // If it returns a full object, you might need 'result.shortCode')
    const result = await UrlService.shorten(urlToShorten);

    // 3. FIX OUTPUT: Send 'shortCode' exactly as Frontend expects
    return reply.status(201).send({ 
      success: true,
      shortCode: result, // <--- This fixes the "Missing ID/ShortCode" error
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