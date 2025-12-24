import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { config } from '../../config/env';

// 1. Redis Connection Setup (Fixes ECONNREFUSED)
const connection = config.redis.url 
  ? new IORedis(config.redis.url, { maxRetriesPerRequest: null }) 
  : new IORedis({ 
      host: config.redis.host, 
      port: Number(config.redis.port), 
      maxRetriesPerRequest: null 
    });

// 2. Queue Definition
export const analyticsQueue = new Queue('analytics-queue', {
  connection
});

// 3. Helper Function (The missing piece!)
export const addAnalyticsJob = async (data: { shortCode: string; userAgent?: string; ip?: string }) => {
  await analyticsQueue.add('click-event', data, {
    removeOnComplete: true, // Auto-delete job after success to save RAM
    removeOnFail: 500       // Keep last 500 failed jobs for debugging
  });
};