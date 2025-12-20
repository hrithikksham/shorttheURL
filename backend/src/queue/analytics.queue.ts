import { Queue } from 'bullmq';
import { config } from '../../config/env';

// Create a new queue named 'analytics-queue'
export const analyticsQueue = new Queue('analytics-queue', {
  connection: {
    host: config.redis.host,
    port: config.redis.port
  }
});

export const addAnalyticsJob = async (data: { shortCode: string; userAgent?: string; ip?: string }) => {
  // 'click' is the job name
  await analyticsQueue.add('click', data, {
    removeOnComplete: true, // Auto-delete successful jobs to save Redis memory
    attempts: 3 // Retry 3 times if DB is down
  });
};