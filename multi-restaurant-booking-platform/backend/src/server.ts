import "dotenv/config";
import express, { NextFunction, Request, Response } from 'express';
import cors from "cors";
import connectDB from "./config/database.js";
import authRouter from "./routes/auth.routes.js";
import restaurantRouter from "./routes/restaurant.routes.js";
import bookingRouter from "./routes/booking.routes.js";

const app = express();
connectDB();

// Middleware
app.use(cors())
app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.send('Server is Live!');
});

// API ROUTES
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/restaurants', restaurantRouter);
app.use('/api/v1/bookings', bookingRouter);

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled Error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Server Error',
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});