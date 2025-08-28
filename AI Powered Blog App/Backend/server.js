import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './config/database.js';
import adminRouter from './routes/admin.routes.js';
import blogRouter from './routes/blog.routes.js';

const app = express();

// Connect to MongoDB
await connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Api is working');
});
app.use('/api/admin', adminRouter);
app.use('/api/blog', blogRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});