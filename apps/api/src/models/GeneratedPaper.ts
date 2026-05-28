import mongoose, { Schema, Document } from 'mongoose';

export interface IGeneratedPaper extends Document {
  assignmentId: string;
  title: string;
  subject: string;
  duration: string;
  totalMarks: number;
  sections: {
    title: string;
    instruction: string;
    questions: {
      questionNumber: number;
      text: string;
      difficulty: 'easy' | 'medium' | 'hard';
      marks: number;
      type?: string;
      options?: string[];
    }[];
  }[];
  rawProviderUsed: 'gemini' | 'groq' | 'mock';
  createdAt: Date;
  updatedAt: Date;
}

const GeneratedPaperSchema: Schema = new Schema({
  assignmentId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  duration: { type: String, required: true },
  totalMarks: { type: Number, required: true },
  sections: [{
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    questions: [{
      questionNumber: { type: Number, required: true },
      text: { type: String, required: true },
      difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
      marks: { type: Number, required: true },
      type: { type: String },
      options: [{ type: String }]
    }]
  }],
  rawProviderUsed: { type: String, enum: ['gemini', 'groq', 'mock'], required: true }
}, {
  timestamps: true
});

export const GeneratedPaper = mongoose.model<IGeneratedPaper>('GeneratedPaper', GeneratedPaperSchema);
