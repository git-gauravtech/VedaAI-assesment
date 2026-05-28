import express from 'express';
import cors from 'cors';
import assignmentRoutes from './routes/assignmentRoutes';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);

export default app;
