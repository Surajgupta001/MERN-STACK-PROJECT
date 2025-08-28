import express from 'express';
import 'dotenv/config'
import cors from 'cors';
import connectDB from './config/database.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.controllers.js';

// Database Connection
connectDB();

const app = express();

app.use(cors()); // Enable CORS (Cross-Origin Resource Sharing) for all routes
app.use(express.json());

// Clerk Middleware
app.use(clerkMiddleware())

// Api to listen to Clerk Webhook
app.use('/api/clerk', clerkWebhooks);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Welcome to the Hotel Booking API');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

