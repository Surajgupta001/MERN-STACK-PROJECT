import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/database.js';
import userRouter from './routes/user.routes.js';
import messageRouter from './routes/message.routes.js';
import { Server } from 'socket.io';

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO server
export const io = new Server(server, {
    cors:{
        origin: process.env.CORS
    }
});

// Store online users
export const userSocketMap = {}; // { userId: socketId }

// Socket.io connection handler
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log(`User connected: ${userId}`);
    
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    // Emit online users to all connected clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${userId}`);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

// Middleware setup
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Routes SetUp
app.use('/api/status', (req, res) => res.send('Server is running'));
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter);

// Connect to MongoDB
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});