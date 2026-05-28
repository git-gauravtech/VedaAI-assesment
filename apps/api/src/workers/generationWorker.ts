import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { Assignment } from '../models/Assignment';
import { GeneratedPaper } from '../models/GeneratedPaper';
import { emitGenerationProgress } from '../services/socket/socketService';
import { generateQuestionPaper } from '../services/ai/generator';
import { parseDSL } from '../services/parser/dslParser';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-2.5-flash';

const connection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: REDIS_URL.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined,
});

connection.on('error', (err) => {
  console.error('Redis Connection Error in generationWorker:', err);
});

async function repairDSL(malformedText: string): Promise<string> {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const prompt = `The following text was supposed to be in a specific DSL format, but it failed to parse. 
Please fix it and return ONLY the corrected DSL format. Do not return JSON or markdown.

Required Format Example:
PAPER_TITLE: Science
SUBJECT: Physics
DURATION: 3 Hours
TOTAL_MARKS: 20

SECTION: A
INSTRUCTION: Answer all.
Q1 | easy | 1 | What is the unit of force?
OPTIONS: A) Joule | B) Newton | C) Watt | D) Pascal

SECTION: B
INSTRUCTION: Answer the following.
Q2 | medium | 2 | Define acceleration.

IMPORTANT RULES:
- For MCQ questions, include an OPTIONS: line immediately after the question line with A), B), C), D) choices separated by |.
- For Diagram/Graph questions, include <mermaid>...</mermaid> tags in the question text. Make sure all text labels inside Mermaid shapes are wrapped in double quotes, e.g. A["Text"] instead of A[Text], especially when containing parentheses or special characters.
- For Short/Long/Numerical questions, no OPTIONS: line is needed.

Malformed Text:
${malformedText}
`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Repair failed:', error);
    throw error;
  }
}

async function processGeneration(job: Job) {
  const { assignmentId } = job.data;
  
  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) throw new Error('Assignment not found');

    // 1. Update state to generating
    assignment.status = 'generating';
    await assignment.save();
    emitGenerationProgress(assignmentId, 'generation:processing');

    emitGenerationProgress(assignmentId, 'generation:prompt-created');

    // 2. AI Started
    emitGenerationProgress(assignmentId, 'generation:ai-started');
    
    // Call AI Services
    const { text, provider } = await generateQuestionPaper(assignment);
    
    // 3. AI Completed
    emitGenerationProgress(assignmentId, 'generation:ai-completed');

    // 4. Parsing
    emitGenerationProgress(assignmentId, 'generation:parsing');
    
    let parsedData;
    try {
      parsedData = parseDSL(text);
    } catch (parseError) {
      console.warn('First parse failed, attempting repair...');
      // Repair Attempt
      const repairedText = await repairDSL(text);
      parsedData = parseDSL(repairedText);
    }

    // 5. Validated
    emitGenerationProgress(assignmentId, 'generation:validated');

    // 6. Store
    const generatedPaper = new GeneratedPaper({
      assignmentId,
      title: parsedData.title,
      subject: parsedData.subject,
      duration: parsedData.duration,
      totalMarks: parsedData.totalMarks || assignment.questionConfigurations.reduce((acc, qt) => acc + (qt.count * qt.marks), 0),
      rawProviderUsed: provider,
      sections: parsedData.sections
    });
    
    await generatedPaper.save();
    
    assignment.status = 'completed';
    await assignment.save();

    // 7. Saved & Completed
    emitGenerationProgress(assignmentId, 'generation:saved');
    emitGenerationProgress(assignmentId, 'generation:completed');

  } catch (error: any) {
    console.error(`Generation failed for ${assignmentId}:`, error);
    await Assignment.findByIdAndUpdate(assignmentId, { status: 'failed' });
    emitGenerationProgress(assignmentId, 'generation:failed', { error: error.message });
  }
}

export function initializeWorkers() {
  const worker = new Worker('generationQueue', processGeneration, { connection: connection as any });
  
  worker.on('completed', job => {
    console.log(`Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    console.log(`Job ${job?.id} failed with error ${err.message}`);
  });

  return worker;
}
