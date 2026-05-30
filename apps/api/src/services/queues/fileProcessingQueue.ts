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
  console.error('Redis Connection Error in fileProcessingQueue:', err);
});

export const fileProcessingQueue = new Queue('fileProcessingQueue', { connection: connection as any });

export async function addFileProcessingJob(
  assignmentId: string,
  filePath: string,
  originalName: string,
  mimeType: string,
  size: number
) {
  await fileProcessingQueue.add(
    'process-file',
    { assignmentId, filePath, originalName, mimeType, size },
    {
      jobId: `file-${assignmentId}`,
      removeOnComplete: true,
      removeOnFail: true,
      attempts: 1,
    }
  );
}