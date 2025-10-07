import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/database.js';
import { inngest, functions } from './inngest/index.js';
import { serve } from "inngest/express";
import { clerkMiddleware } from '@clerk/express'
import userRouter from './routes/user.routes.js';

// App config
const app = express();

// Database config
await connectDB();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware())

app.get('/', (req, res) => {
    res.send('Server is running...');
});

app.use("/api/inngest", serve({ 
    client: inngest, 
    functions
}));

app.use('/api/user', userRouter);

const port = process.env.PORT || 8000;

// Export the app for Vercel serverless entry
export default app;

// Run the listener only when not in Vercel serverless environment
if (!process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}