import express from 'express';
import { discoverUsers, followUser, getUserData, unfollowUser, updateUserData } from '../controllers/user.controllers.js';
import { protect } from '../middlewares/auth.js';
import { upload } from '../config/multer.js';

const userRouter = express.Router();

userRouter.get('/data', protect, getUserData);
userRouter.post('/update', upload.fields([{ name: 'profile', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), protect, updateUserData);
userRouter.post('/discover', protect, discoverUsers);
userRouter.post('/follow', protect, followUser);
userRouter.post('/unfollow', protect, unfollowUser);

export default userRouter;