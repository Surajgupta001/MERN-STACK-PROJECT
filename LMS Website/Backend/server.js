import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import ConnectDB from './config/database.js';
import { clerkWebhooks } from './controllers/webhooks.js';

// Initialize Express app
const app = express();

// Database connection
await ConnectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Default route
app.get('/', (req, res) => {
    res.send('LMS Backend is running');
});

// Import and use webhooks route
app.post('/clerk', express.json(), clerkWebhooks);

// Port configuration
const port = process.env.PORT || 5000;

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});