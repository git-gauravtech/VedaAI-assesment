import { Router, Request, Response } from 'express';
import multer from 'multer';
import { Assignment } from '../models/Assignment';
import { GeneratedPaper } from '../models/GeneratedPaper';
import { addGenerationJob } from '../services/queues/generationQueue';
import { addFileProcessingJob } from '../services/queues/fileProcessingQueue';
import { createAssignmentSchema } from '../validators/assignmentValidators';
import path from 'path';
import os from 'os';

import { auth, AuthRequest } from '../middleware/auth';

const router = Router();
const upload = multer({ dest: os.tmpdir() });

// GET /api/assignments
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const assignments = await Assignment.find({ userId: req.user?.id }).sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/assignments
router.post('/', auth, upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    const rawData = {
      ...req.body,
      questionConfigurations: typeof req.body.questionConfigurations === 'string' 
        ? JSON.parse(req.body.questionConfigurations) 
        : req.body.questionConfigurations
    };

    const validatedData = createAssignmentSchema.parse(rawData);
    
    const assignment = new Assignment({
      ...validatedData,
      userId: req.user?.id,
      status: 'draft'
    });
    
    await assignment.save();

    if (req.file) {
      await addFileProcessingJob(
        assignment.id, 
        req.file.path, 
        req.file.originalname, 
        req.file.mimetype, 
        req.file.size
      );
      assignment.status = 'queued'; // Using queued for file processing as well
      await assignment.save();
      return res.status(201).json(assignment);
    }

    res.status(201).json(assignment);
  } catch (error: any) {
    res.status(400).json({ error: error.errors || error.message });
  }
});

// GET /api/assignments/:id
router.get('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id, userId: req.user?.id });
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json(assignment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/assignments/:id/generate
router.post('/:id/generate', auth, async (req: AuthRequest, res: Response) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id, userId: req.user?.id });
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    assignment.status = 'queued';
    await assignment.save();

    await addGenerationJob(assignment.id);

    res.json({ message: 'Generation queued successfully', status: 'queued' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/assignments/:id/result
router.get('/:id/result', auth, async (req: AuthRequest, res: Response) => {
  try {
    // We verify the user owns the assignment
    const assignment = await Assignment.findOne({ _id: req.params.id, userId: req.user?.id });
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

    const paper = await GeneratedPaper.findOne({ assignmentId: req.params.id });
    if (!paper) {
      return res.status(404).json({ error: 'Result not found' });
    }
    res.json(paper);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/assignments/:id/regenerate
router.post('/:id/regenerate', auth, async (req: AuthRequest, res: Response) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id, userId: req.user?.id });
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Delete existing paper if any
    await GeneratedPaper.deleteMany({ assignmentId: req.params.id });

    assignment.status = 'queued';
    await assignment.save();

    await addGenerationJob(assignment.id);

    res.json({ message: 'Regeneration queued successfully', status: 'queued' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/assignments/:id
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const assignment = await Assignment.findOneAndDelete({ _id: req.params.id, userId: req.user?.id });
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    // Also remove generated paper if any
    await GeneratedPaper.deleteMany({ assignmentId: req.params.id });
    res.json({ message: 'Assignment deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
