import express from 'express';
import "dotenv/config";
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware())

const PORT = process.env.PORT || 5000;

// Basic route to test server
app.get('/', (req, res) => {
  res.send('Welcome to the Social Media Marketplace Backend!');
});

// Set up the "/api/inngest" (recommended) routes with the serve handler
app.use("/api/inngest", serve({ client: inngest, functions }));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});