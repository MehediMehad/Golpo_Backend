import type { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import config from './app/configs';
import { getLocalIP } from './app/helpers/devHelpers';
// import redis from './app/libs/redis';
import { initializeSocket } from './app/modules/chats/chat.socket';

let server: HttpServer;
let io: SocketIOServer;

async function main() {
  try {
    // await redis.ping();
    // 🟢 Start the server
    const port = config.app.port;

    server = app.listen(port, async () => {
      console.log(`🟢 Server is running on port ${port}`);
      getLocalIP(); // 🖥️ Your PC's local IPv4 address(es)

      // Initialize Socket.IO
      io = new SocketIOServer(server, {
        cors: {
          origin: '*', // Adjust based on your frontend URL
          methods: ['GET', 'POST'],
        },
      });

      // Pass io to socket handler
      initializeSocket(io);
    });

    // 🔐 Handle Uncaught Exceptions
    process.on('uncaughtException', (error) => {
      console.error('❌ Uncaught Exception:', error);
      shutdown();
    });

    // 🔐 Handle Unhandled Promise Rejections
    process.on('unhandledRejection', (reason) => {
      console.error('❌ Unhandled Rejection:', reason);
      shutdown();
    });

    // 🛑 Graceful Shutdown
    process.on('SIGTERM', () => {
      console.info('🔁 SIGTERM received.');
      shutdown();
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// 🔁 Graceful Server Shutdown
async function shutdown() {
  try {
    console.log('⏳ Shutting down...');

    // Close HTTP server
    if (server) {
      try {
        await new Promise<void>((resolve, reject) => {
          server.close((err) => (err ? reject(err) : resolve()));
        });
        console.info('🔒 HTTP server closed.');
      } catch (err) {
        console.error('❌ Error closing HTTP server:', err);
      }
    }

    // Close Socket.IO
    if (io) {
      io.close();
      console.info('🔒 Socket.IO server closed.');
    }

    // Close Redis
    // await redis.quit();
    console.info('🗄️ Redis connection closed.');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error during shutdown:', err);
    process.exit(1);
  }
}

main();
