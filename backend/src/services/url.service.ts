// src/services/url.service.ts
import { UrlRepository } from '../repositories/url.repository';
import { CacheService } from '../cache/cache.service';
import { encodeId } from '../utils/base62';
import { config } from '../../config/env';

export class UrlService {
  
  // Write Path: Shorten URL
  static async shorten(originalUrl: string): Promise<string> {
    // 1. Create DB record to get unique ID (Simulating Snowflake ID for simplicity)
    const record = await UrlRepository.createEmpty();
    
    // 2. Encode ID to ShortCode
    const shortCode = encodeId(record.id);
    
    // 3. Update DB with the code
    await UrlRepository.update(record.id, originalUrl, shortCode);

    // 4. Return full short URL
    return `${config.app.baseUrl}/${shortCode}`;
  }

  // Read Path: Redirect
  static async getOriginalUrl(shortCode: string): Promise<string | null> {
    // 1. Check Cache (Fastest)
    const cachedUrl = await CacheService.getUrl(shortCode);
    if (cachedUrl) return cachedUrl;

    // 2. Cache Miss -> Check DB
    const record = await UrlRepository.findByCode(shortCode);
    if (!record) return null;

    // 3. Populate Cache (for next time)
    await CacheService.setUrl(shortCode, record.original);

    return record.original;
  }
}