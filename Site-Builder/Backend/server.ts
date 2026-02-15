import express from 'express';
import type { Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import { auth } from './lib/auth';
import { toNodeHandler } from 'better-auth/node';
import userRouter from './routes/user.routes';
import projectRouter from './routes/project.routes';

const app = express();

const port = process.env.PORT || 3000;

const corsOrigins = {
    origin: process.env.TRUSTED_ORIGINS?.split(',') || [],
    credentials: true,
};

app.use(cors(corsOrigins));

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json({
    limit: '50mb',
}));

app.get('/', (req: Request, res: Response) => {
    res.send('Server is running! Welcome to the Site Builder Backend.');
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/project', projectRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});