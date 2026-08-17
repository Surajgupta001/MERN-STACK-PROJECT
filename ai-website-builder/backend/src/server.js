import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { connectToDatabase } from './config/database.js';

const app = express();
const port = process.env.PORT || 5000;

// Database Connection
connectToDatabase();

app.use(cors({
    origin: process.env.ORIGINS.split(','),
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Default Route
app.get('/', (req, res) => {
    res.send('API Working 🚀');
});

// Global Error Handler
app.use((err, _req, res, _next) => {
    console.error(`[Error]: ${err.message}`);
    res
        .status(500)
        .json({
            success: false,
            message: 'Global Internal Server Error',
            error: err.message
        })
});

// Start Server
app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
});