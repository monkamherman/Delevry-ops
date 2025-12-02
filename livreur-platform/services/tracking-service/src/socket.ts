import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import Redis from 'ioredis';

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

const positions = new Map<string, { lat: number; lng: number; timestamp: number }>();

export function createSocketServer(server: http.Server) {
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Client connecté : ${socket.id}`);

    socket.on('updatePosition', (data: { livreurId: string; lat: number; lng: number; timestamp: number }) => {
      const { livreurId, lat, lng, timestamp } = data;
      positions.set(livreurId, { lat, lng, timestamp });

      redisClient.set(`pos:${livreurId}`, JSON.stringify({ lat, lng, timestamp }));

      io.emit(`positionUpdate:${livreurId}`, { lat, lng, timestamp });
    });

    socket.on('disconnect', () => {
      console.log(`Client déconnecté : ${socket.id}`);
    });
  });
}
