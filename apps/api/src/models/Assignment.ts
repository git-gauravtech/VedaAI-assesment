import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  userId: string;
  title: string;
  subject: string;
  grade: string;
  dueDate: string;
  questionConfigurations: {
    type: string;
    count: number;
    marks: number;
  }[];
  difficultyMix: string;
  additionalInstructions: string;
  uploadedFile?: {
    originalName: string;
    mimeType: string;
    size: number;
    extractedText?: string;
    compressedSummary?: string;
  };
  status: 'draft' | 'queued' | 'generating' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema: Schema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  grade: { type: String, required: true },
  dueDate: { type: String, required: true },
  questionConfigurations: [{
    type: { type: String, required: true },
    count: { type: Number, required: true },
    marks: { type: Number, required: true }
  }],
  difficultyMix: { type: String, required: true },
  additionalInstructions: { type: String, default: '' },
  uploadedFile: {
    originalName: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    extractedText: { type: String },
    compressedSummary: { type: String }
  },
  status: { 
    type: String, 
    enum: ['draft', 'queued', 'generating', 'completed', 'failed'],
    default: 'draft'
  }
}, {
  timestamps: true
});

export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);
