import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import multer from 'multer';
import connectDB from './config/database.js';
import authRouter from './routes/auth.routes.js';
import employeeRouter from './routes/employee.routes.js';
import profileRouter from './routes/profile.routes.js';
import attendanceRouter from './routes/attendance.routes.js';
import leaveRouter from './routes/leave.routes.js';
import payslipRouter from './routes/payslips.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

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

// Route imports
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/employees', employeeRouter);
app.use('/api/v1/profile', profileRouter);
app.use('/api/v1/attendance', attendanceRouter);
app.use('/api/v1/leave', leaveRouter);
app.use('/api/v1/payslips', payslipRouter);
app.use('/api/v1/dashboard', dashboardRouter);

// Inngest route
app.use("/api/inngest", serve({ client: inngest, functions }));

await connectDB();

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});