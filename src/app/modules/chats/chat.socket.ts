import type { Server, Socket } from 'socket.io';

export function initializeSocket(io: Server) {
    io.on('connection', (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);
    });
}
