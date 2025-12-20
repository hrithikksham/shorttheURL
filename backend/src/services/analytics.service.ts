import { addAnalyticsJob } from '../queue/analytics.queue';
import { AnalyticsRepository } from '../repositories/analytics.repository';

export class AnalyticsService {
  
  /**
   * WRITE PATH (High Performance)
   * Triggers the async job. Does not wait for DB.
   */
  static async trackClick(shortCode: string, userAgent?: string, ip?: string) {
    // 1. Anonymize IP (Optional but recommended for GDPR)
    // const safeIp = anonymize(ip); 
    
    // 2. Push to Queue
    // We use 'await' here just for the Redis ack (which is < 5ms), 
    // not the DB write (which could be 50-100ms).
    await addAnalyticsJob({ 
      shortCode, 
      userAgent: userAgent || 'unknown', 
      ip: ip || 'unknown' 
    });
  }

  /**
   * READ PATH (Dashboard)
   * Fetches aggregated stats for the frontend.
   */
  static async getUrlStats(shortCode: string) {
    const totalClicks = await AnalyticsRepository.countClicks(shortCode);
    const lastClicks = await AnalyticsRepository.getRecentClicks(shortCode, 10);
    
    return {
      totalClicks,
      recentActivity: lastClicks
    };
  }
}