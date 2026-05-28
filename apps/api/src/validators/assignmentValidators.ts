import { z } from 'zod';

export const createAssignmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  grade: z.string().min(1, 'Grade is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  questionConfigurations: z.array(z.object({
    type: z.string().min(1),
    count: z.number().min(1),
    marks: z.number().min(1)
  })).min(1, 'At least one question configuration is required'),
  difficultyMix: z.string(),
  additionalInstructions: z.string().optional()
});
