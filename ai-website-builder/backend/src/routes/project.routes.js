import { Router } from 'express'
import { createProject, deleteProject, getProject, getPublicProject, listProjects, publishProject, updateProjectFiles } from '../controllers/project.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const projectRouter = Router();

// Public Route
projectRouter.get('/public/:id', getPublicProject);

// Project all following routes
projectRouter.use(authMiddleware);

projectRouter.post('/', createProject);
projectRouter.get('/', listProjects);
projectRouter.get('/:id', getProject);
projectRouter.delete('/:id', deleteProject);
projectRouter.put('/:id/files', updateProjectFiles);
projectRouter.post('/:id/publish', publishProject);

export default projectRouter;