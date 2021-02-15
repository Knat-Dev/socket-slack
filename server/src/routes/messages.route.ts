import { Router } from 'express';
import { messages } from '../controllers';

export const messagesRouter = Router();

messagesRouter.get('/messages', messages);
