// src/services/url.service.ts
import { UrlRepository } from '../repositories/url.repository';
import { CacheService } from '../cache/cache.service';
import { encodeId } from '../utils/base62';
import { config } from '../../config/env';

export class UrlService {
  
  // Write Path: Shorten URL (Now accepts optional alias)
  static async shorten(originalUrl: string, customAlias?: string): Promise<string> {
    let shortCode: string;
    
    // 1. Create the DB row first to get a unique numeric ID
    // (We need this row regardless of whether we use a custom alias or auto-gen)
    const record = await UrlRepository.createEmpty();

    if (customAlias) {
      // 2a. Custom Alias Logic
      // Check if it is already taken
      const existing = await UrlRepository.findByCode(customAlias);
      if (existing) {
        throw new Error('Alias already in use');
      }
      shortCode = customAlias;
    } else {
      // 2b. Auto-Generate Logic
      // Encode the database ID (e.g., 105) to Base62 (e.g., "1H")
      shortCode = encodeId(record.id);
    }
    
    // 3. Update the DB record with the final code and URL
    await UrlRepository.update(record.id, originalUrl, shortCode);

    // 4. Return JUST the shortCode (e.g., "abc") 
    // This fixes your double-URL bug. The controller will attach the base URL.
    return shortCode;
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