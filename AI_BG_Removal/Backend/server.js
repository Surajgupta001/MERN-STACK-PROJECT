import express from 'express'
import 'dotenv/config';
import cors from 'cors';
import connectDB from './configs/database.js';
import userRouter from './routes/user.routes.js';

// App Config
const port = process.env.PORT || 4000;
const app = express();
await connectDB();

// Initialize Middleware
app.use(express.json());
app.use(cors());

// Api routes
app.get('/', (req, res) => {
  res.send('Hello from the API!');
});
app.use('/api/user', userRouter);

// In serverless environments (Vercel), export the app instead of listening here.
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export default app;