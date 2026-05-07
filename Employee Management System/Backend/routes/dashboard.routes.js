import { Router } from 'express';
import { protect } from '../middlewares/auth.js';
import { getDashboard } from '../controllers/dashboard.controllers.js';

const dashboardRouter = Router();

dashboardRouter.get('/', protect, getDashboard);

export default dashboardRouter;