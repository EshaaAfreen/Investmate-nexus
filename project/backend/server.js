// server.js
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import http from 'http';
import { Server } from 'socket.io';
import Message from './models/Message.js';

import ideaRoutes from "./routes/ideaRoutes.js";
import authRoutes from './routes/auth.js';
import investmentRoutes from './routes/investments.js';
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from './routes/paymentRoutes.js';
import internalIdeaRoutes from "./routes/internalIdeaRoutes.js";
import chatRoutes from './routes/chatRoutes.js';
import trackingRoutes from './routes/trackingRoutes.js';

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve uploads folder
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.io Logic
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_room', (userId) => {
        socket.join(userId);
        console.log(`User with ID: ${userId} joined room: ${userId}`);
    });

    socket.on('send_message', async (data) => {
        const { sender, receiver, message, ideaId } = data;
        const newMessage = new Message({
            sender,
            receiver,
            message,
            idea: ideaId || undefined
        });
        await newMessage.save();

        // Emit to receiver's room
        io.to(receiver).emit('receive_message', newMessage);

        // Optionally emit back to sender (or just update UI optimistically)
        // socket.emit('receive_message', newMessage); 
    });

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/tracking', trackingRoutes);

// Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
