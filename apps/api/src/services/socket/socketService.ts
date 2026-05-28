import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: SocketIOServer;

export function initializeSocket(server: HttpServer) {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*', // In production, restrict to frontend URL
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join-assignment-room', (assignmentId: string) => {
      socket.join(`assignment_${assignmentId}`);
      console.log(`Socket ${socket.id} joined room assignment_${assignmentId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function emitGenerationProgress(assignmentId: string, event: string, data?: any) {
  if (io) {
    io.to(`assignment_${assignmentId}`).emit(event, data);
  }
}
