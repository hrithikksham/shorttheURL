import { Worker } from 'bullmq';
import IORedis from 'ioredis'; // Import IORedis
import { AnalyticsRepository } from '../repositories/analytics.repository';
import { config } from '../../config/env';

// Create a robust connection for BullMQ
const connection = config.redis.url 
  ? new IORedis(config.redis.url, { maxRetriesPerRequest: null }) // Cloud
  : new IORedis({ 
      host: config.redis.host, 
      port: Number(config.redis.port), 
      maxRetriesPerRequest: null 
    });

const worker = new Worker('analytics-queue', async (job) => {
  console.log(`Processing analytics for: ${job.data.shortCode}`);
  
  await AnalyticsRepository.recordClick(
    job.data.shortCode,
    job.data.userAgent,
    job.data.ip
  );
  
}, {
  connection // Pass the IORedis instance directly
});

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed!`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed: ${err.message}`);
});

export default worker;