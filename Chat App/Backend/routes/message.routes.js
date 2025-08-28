import express from 'express';
import { protectRoute } from '../middlewares/auth.js';
import { getMessages, getUserForSidebar, markMessagesAsSeen, sendMessage } from '../controllers/message.controllers.js';

const messageRouter = express.Router();

messageRouter.get('/users', protectRoute, getUserForSidebar);
messageRouter.put('/mark/:id', protectRoute, markMessagesAsSeen);
messageRouter.get('/:id', protectRoute, getMessages);
messageRouter.post('/send/:id', protectRoute, sendMessage)

export default messageRouter;