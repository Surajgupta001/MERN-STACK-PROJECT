import express from 'express';
import { protect } from '../middlewares/auth.middlewares.js';
import { getAllUserChats, getChat, sendChatMessage } from '../controllers/chat.controllers.js';

const chatRouter = express.Router();

chatRouter.post('/', protect, getChat);
chatRouter.get('/user', protect, getAllUserChats);
chatRouter.post('/send-message', protect, sendChatMessage);

export default chatRouter;