import { Worker } from 'bullmq';
import { AnalyticsRepository } from '../repositories/analytics.repository';
import { config } from '../../config/env';

const worker = new Worker('analytics-queue', async (job) => {
  console.log(`Processing analytics for: ${job.data.shortCode}`);
  
  await AnalyticsRepository.recordClick(
    job.data.shortCode,
    job.data.userAgent,
    job.data.ip
  );
  
}, {
  connection: {
    host: config.redis.host,
    port: config.redis.port
  }
});

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed!`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed: ${err.message}`);
});

export default worker;