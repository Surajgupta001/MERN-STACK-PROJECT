import express from 'express';
import dotenv from 'dotenv/config';
import cors from 'cors';
import connectDB from './config/database.js';
import userRouter from './routes/user.routes.js';
import ownerRouter from './routes/owner.routes.js';
import bookingRouter from './routes/booking.routes.js';

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
    res.send('Car Rental Booking Platform Backend is running');
});

// Routes setup
app.use('/api/users', userRouter);
app.use('/api/owners', ownerRouter);
app.use('/api/bookings', bookingRouter);

// Start the server
const port = process.env.PORT || 5000;

// Listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
