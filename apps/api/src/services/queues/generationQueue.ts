import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const connection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: REDIS_URL.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
});

connection.on('error', (err) => {
  console.error('Redis Connection Error in generationQueue:', err);
});

export const generationQueue = new Queue('generationQueue', { connection: connection as any });

export async function addGenerationJob(assignmentId: string) {
  await generationQueue.add(
    'generate-paper',
    { assignmentId },
    {
      jobId: `generation-${assignmentId}`,
      removeOnComplete: true,
      removeOnFail: true,
      attempts: 1,
    }
  );
}
