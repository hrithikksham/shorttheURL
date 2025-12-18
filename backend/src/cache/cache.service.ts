// src/cache/cache.service.ts
import redis from './redis.client';

export class CacheService {
  private static TTL = 3600; // 1 hour cache by default

  static async getUrl(shortCode: string): Promise<string | null> {
    return redis.get(`url:${shortCode}`);
  }

  static async setUrl(shortCode: string, longUrl: string): Promise<void> {
    await redis.set(`url:${shortCode}`, longUrl, 'EX', this.TTL);
  }
}