import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { roomRouter } from './routes/roomRoutes.js';
import { codeRouter } from './routes/codeRoutes.js';
import { chatRouter } from './routes/chatRoutes.js';
import { inquiryRouter } from './routes/inquiryRoutes.js';
import { setupSocketHandlers } from './sockets/socketHandler.js';
import { supabase } from './supabaseClient.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration supporting Vite dev server ports
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((u) => u.trim())
  : ['http://localhost:5173', 'http://localhost:5174'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      return callback(null, true); // Dev convenience
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  })
);

app.use(express.json());

// Create HTTP server and mount Socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Setup real-time Socket.io handlers
setupSocketHandlers(io);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'DevSync Real-Time Collaborative Workspace Backend',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    supabaseConfigured: Boolean(supabase),
    activeSockets: io.engine.clientsCount
  });
});

// REST API Routes
app.use('/api/rooms', roomRouter);
app.use('/api/code', codeRouter);
app.use('/api/chat', chatRouter);
app.use('/api/inquiries', inquiryRouter);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'DevSync API & Real-Time Sync Server',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 [Server Error]:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start listening
server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 DevSync Backend active at http://localhost:${PORT}`);
  console.log(`📡 Real-Time Socket.io ready on ws://localhost:${PORT}`);
  console.log(`🛡️  Database: ${supabase ? 'Supabase PostgreSQL' : 'In-Memory Cache (Ready for Supabase credentials)'}`);
  console.log(`======================================================\n`);
});
