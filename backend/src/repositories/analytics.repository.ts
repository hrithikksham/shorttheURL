import {prisma} from '../../config/database';

export class AnalyticsRepository {
  static async recordClick(shortCode: string, userAgent?: string, ip?: string) {
    return prisma.analytics.create({
      data: {
        shortCode,
        userAgent: userAgent || 'unknown',
        ip: ip || 'unknown'
      }
    });
  }
  
  // 1. Get Total Count
  static async countClicks(shortCode: string): Promise<number> {
    return prisma.analytics.count({
      where: { shortCode }
    });
  }

  // 2. Get Recent Logs (e.g. Last 5 visitors)
  static async getRecentClicks(shortCode: string, limit: number) {
    return prisma.analytics.findMany({
      where: { shortCode },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        createdAt: true,
        userAgent: true,
        // Don't select IP to protect user privacy in dashboard
      }
    });
  }
}