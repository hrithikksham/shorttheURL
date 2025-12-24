// src/cache/cache.service.ts
import Redis from 'ioredis';
import { config } from '../../config/env';

// Initialize Redis: Use Cloud URL if available, otherwise fallback to local Docker
// This single line fixes your "ECONNREFUSED" error if you have the REDIS_URL in your .env
const redis = new Redis(config.redis.url || 'redis://localhost:6379');

export class CacheService {
  private static TTL = 3600; // 1 hour cache by default

  static async getUrl(shortCode: string): Promise<string | null> {
    try {
      return await redis.get(`url:${shortCode}`);
    } catch (error) {
      console.warn('Redis Get Error (Cache Miss):', error);
      return null; // Fail safe: if Redis is down, return null so we fetch from DB
    }
  }

  static async setUrl(shortCode: string, longUrl: string): Promise<void> {
    try {
      await redis.set(`url:${shortCode}`, longUrl, 'EX', this.TTL);
    } catch (error) {
      console.warn('Redis Set Error:', error);
      // We don't throw here because caching is optional; the app should still work
    }
  }
}