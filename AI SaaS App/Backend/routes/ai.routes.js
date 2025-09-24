import express from 'express';
import { auth } from '../middlewares/auth.js';
import { generateArticles, generateBlogTitle, generateImage } from '../controllers/ai.controllers.js';

const aiRouter = express.Router();

aiRouter.post('/generate-article', auth, generateArticles);
aiRouter.post('/generate-blog-title', auth, generateBlogTitle);
aiRouter.post('/generate-image', auth, generateImage);

export default aiRouter;