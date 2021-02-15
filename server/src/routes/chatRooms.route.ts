import { Router } from 'express';
import { createChatRoom, getAllRooms } from '../controllers/ChatRoom';
import { isAuthorized } from '../middleware';
import { messagesRouter } from './messages.route';

export const chatRoomsRoute = Router();

chatRoomsRoute.post('/', isAuthorized, createChatRoom);
chatRoomsRoute.get('/', isAuthorized, getAllRooms);
chatRoomsRoute.use(messagesRouter);
