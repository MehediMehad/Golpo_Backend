import type { RoleEnum } from '@prisma/client';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import type { Server, Socket } from 'socket.io';

import config from '../../configs';
import ApiError from '../../errors/ApiError';

interface AuthenticatedSocket extends Socket {
  user: { userId: string; role: RoleEnum };
}

export function initializeSocket(io: Server) {
  // Middleware: authenticate socket with JWT
  io.use((socket: Socket & { user?: { userId: string; role: RoleEnum } }, next) => {
    const token =
      socket.handshake.auth?.token || socket.handshake.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }
    try {
      const decoded = jwt.verify(token, config.auth.jwt.access_secret!) as {
        userId: string;
        role: RoleEnum;
      };
      socket.user = { userId: decoded.userId, role: decoded.role };
      next();
        } catch (err: any) { // eslint-disable-line
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }
  });

  io.on('connection', (socket: Socket) => {
    const authenticatedSocket = socket as AuthenticatedSocket;
    const { userId, role } = authenticatedSocket.user;

    console.log(`User connected: ${userId} | Role: ${role} | Socket ID: ${socket.id}`);
  });
}
