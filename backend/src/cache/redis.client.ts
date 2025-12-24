import Redis from 'ioredis';
import { config } from '../../config/env';

let redis: Redis;

// Check if we have a full Connection URL (like from Upstash/Render)
if (config.redis.url) {
  console.log('Redis: Connecting via URL...');
  redis = new Redis(config.redis.url);
} else {
  // Fallback to Host/Port (Local Docker)
  console.log('Redis: Connecting via Host/Port...');
  redis = new Redis({
    host: config.redis.host,
    // FIX: Force convert to Number() to satisfy TypeScript
    port: Number(config.redis.port), 
  });
}

redis.on('connect', () => console.log('✅ Redis connected successfully'));
redis.on('error', (err) => console.error('❌ Redis Connection Error:', err));

export default redis;