import { FastifyRequest, FastifyReply } from 'fastify';
import redis from '../cache/redis.client';
import { HTTP_STATUS } from '../constants/httpStatus';

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_REQUESTS = 60; // 1 request per second average

export const rateLimiter = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    // 1. Identify the user (IP address)
    // In production, behind a proxy (like Nginx/Cloudflare), use req.headers['x-forwarded-for']
    const ip = req.ip || '127.0.0.1';
    
    const key = `rate_limit:${ip}`;

    // 2. Increment the counter
    const currentCount = await redis.incr(key);

    // 3. If this is the first request, set the expiration window
    if (currentCount === 1) {
      await redis.expire(key, WINDOW_SIZE_IN_SECONDS);
    }

    // 4. Check if limit exceeded
    if (currentCount > MAX_REQUESTS) {
      // Get time remaining for the headers
      const ttl = await redis.ttl(key);
      
      reply.header('X-RateLimit-Limit', MAX_REQUESTS);
      reply.header('X-RateLimit-Remaining', 0);
      reply.header('Retry-After', ttl);
      
      return reply.status(HTTP_STATUS.TOO_MANY_REQUESTS).send({
        error: 'Too Many Requests',
        message: `You have exceeded the ${MAX_REQUESTS} requests in ${WINDOW_SIZE_IN_SECONDS} seconds limit.`,
        retryAfter: ttl
      });
    }

    // 5. Add headers for good DX (Developer Experience)
    reply.header('X-RateLimit-Limit', MAX_REQUESTS);
    reply.header('X-RateLimit-Remaining', MAX_REQUESTS - currentCount);

  } catch (error) {
    // Fail Open: If Redis is down, let traffic through (don't block legitimate users)
    console.error('Rate Limiter Error:', error);
  }
};