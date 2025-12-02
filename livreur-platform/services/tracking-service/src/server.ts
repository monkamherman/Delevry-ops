import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import Redis from 'ioredis';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
});

app.use(cors());
app.use(express.json());

// Stockage temporaire des positions (à remplacer par Redis ou DB)
const positions = new Map<string, { lat: number; lng: number; timestamp: number }>();

io.on('connection', (socket) => {
  console.log(`Client connecté : ${socket.id}`);

  socket.on('updatePosition', (data: { livreurId: string; lat: number; lng: number; timestamp: number }) => {
    const { livreurId, lat, lng, timestamp } = data;
    positions.set(livreurId, { lat, lng, timestamp });

    // Stocker dans Redis
    redisClient.set(`pos:${livreurId}`, JSON.stringify({ lat, lng, timestamp }));

    // Diffuser la position aux clients abonnés
    io.emit(`positionUpdate:${livreurId}`, { lat, lng, timestamp });
  });

  socket.on('disconnect', () => {
    console.log(`Client déconnecté : ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Tracking service running on port ${PORT}`);
});
