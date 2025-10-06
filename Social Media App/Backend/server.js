import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/database.js';
import { inngest, functions } from './inngest/index.js';
import { serve } from "inngest/express";

// App config
const app = express();

// Database config
connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Server is running...');
});

app.use("/api/inngest", serve({ 
    client: inngest, 
    functions
}));

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});