import express from 'express';
import { protect } from '../middleware/auth';
import { createUserProject, getAllUserProjects, getUserCredit, getUserProject, purchaseCredits, togglePublish } from '../controllers/user.controllers';

const userRouter = express.Router();

userRouter.get('/credits', protect, getUserCredit);
userRouter.post('/project', protect, createUserProject);
userRouter.post('/project/:projectId', protect, getUserProject);
userRouter.post('/projects', protect, getAllUserProjects);
userRouter.post('/publish-toggle/:projectId', protect, purchaseCredits);

export default userRouter;