import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/database.js';
import { serve } from "inngest/express";
import { inngest, functions } from './inngest/index.js';
import { clerkMiddleware } from '@clerk/express'

const app = express();

await connectDB();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.get('/', (req, res) => {
    res.send('Welcome to the Social Media App API');
});

// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});