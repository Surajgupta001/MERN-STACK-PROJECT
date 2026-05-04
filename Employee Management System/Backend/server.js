import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import multer from 'multer';
import connectDB from './config/database.js';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(multer().none());

// Routes
app.get('/', (req, res) => {
  res.send('Employee Management System API');
});

await connectDB();

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});