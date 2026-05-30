import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import fs from 'fs';
if (typeof (global as any).DOMMatrix === 'undefined') {
  (global as any).DOMMatrix = class DOMMatrix { };
}
if (typeof (global as any).ImageData === 'undefined') {
  (global as any).ImageData = class ImageData { };
}
if (typeof (global as any).Path2D === 'undefined') {
  (global as any).Path2D = class Path2D { };
}
// Removed pdfParse require from top level
import { Assignment } from '../models/Assignment';
import { addGenerationJob } from '../services/queues/generationQueue';
import { summarizeStudyMaterial } from '../services/ai/summarizer';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const connection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: REDIS_URL.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
});

connection.on('error', (err) => {
  console.error('Redis Connection Error in fileWorker:', err);
});

async function processFile(job: Job) {
  const { assignmentId, filePath, originalName, mimeType, size } = job.data;
  
  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) throw new Error('Assignment not found');

    let rawText = '';
    
    // 1. Extract Text
    if (mimeType === 'application/pdf') {
      let pdfParse = require('pdf-parse');
      if (typeof pdfParse !== 'function' && pdfParse && typeof pdfParse.default === 'function') {
        pdfParse = pdfParse.default;
      }
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      rawText = data.text;
    } else if (mimeType === 'text/plain') {
      rawText = fs.readFileSync(filePath, 'utf8');
    } else if (mimeType === 'image/jpeg' || mimeType === 'image/png') {
      const tesseractModule = require('tesseract.js');
      const recognizeFn = tesseractModule.recognize || (tesseractModule.default && tesseractModule.default.recognize);
      if (!recognizeFn) {
        throw new Error('Tesseract recognize function not found');
      }
      const { data: { text } } = await recognizeFn(filePath, 'eng');
      rawText = text;
    }

    // 2. Clean Text
    const cleanedText = rawText.replace(/\s+/g, ' ').trim();
    
    // 3. Compress / Summarize
    let compressedSummary = '';
    
    if (cleanedText.length > 5000) {
      compressedSummary = await summarizeStudyMaterial(cleanedText);
    } else {
      compressedSummary = cleanedText;
    }

    // 4. Update MongoDB
    assignment.uploadedFile = {
      originalName,
      mimeType,
      size,
      extractedText: cleanedText.slice(0, 50000), // Only store up to 50k chars to prevent Document too large
      compressedSummary
    };
    await assignment.save();

    // 5. Trigger Generation Queue
    await addGenerationJob(assignmentId);

  } catch (error: any) {
    console.error(`File processing failed for ${assignmentId}:`, error);
    // If extraction fails, we still want to generate the paper based on instructions alone
    // So we add to generation queue anyway
    await addGenerationJob(assignmentId);
  } finally {
    // Clean up uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

export function initializeFileWorker() {
  const worker = new Worker('fileProcessingQueue', processFile, {
  connection: connection as any,
  concurrency: 1,
});
  worker.on('completed', job => {
    console.log(`File Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    console.log(`File Job ${job?.id} failed with error ${err.message}`);
  });

  return worker;
}
