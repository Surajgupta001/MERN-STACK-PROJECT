import express from 'express';
import protect from '../middlewares/authMiddlewares.js';
import { createResume, deleteResume, getResumeById, getResumeByIdPublic, updateResume } from '../controllers/ResumeControllers.js';
import upload from '../config/multer.js';

const resumeRouter = express.Router();

resumeRouter.post('/create', protect, createResume);
resumeRouter.put('/update', upload.single('image'), protect, updateResume);
resumeRouter.delete('/delete/:resumeId', protect, deleteResume);
resumeRouter.get('/get/:resumeId', protect, getResumeById);
resumeRouter.get('/public/:resumeId', getResumeByIdPublic);

export default resumeRouter;