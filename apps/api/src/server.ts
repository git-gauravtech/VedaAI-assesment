import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';
import { initializeSocket } from './services/socket/socketService';
import { initializeWorkers } from './workers/generationWorker';
import { initializeFileWorker } from './workers/fileWorker';

dotenv.config();

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vedaai';

const server = http.createServer(app);

// Initialize Socket.IO
export const io = initializeSocket(server);

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Initialize BullMQ workers
    initializeWorkers();
    initializeFileWorker();
    console.log('Workers initialized');

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();