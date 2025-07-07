import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import threatRoutes from './routes/threat.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});
export { io }; // Export for use in routes

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/threats', threatRoutes);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
