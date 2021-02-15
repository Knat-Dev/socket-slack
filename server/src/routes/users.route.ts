import { Router } from 'express';
import { login, logout, refresh, register } from '../controllers';

export const userRouter = Router();

userRouter.post('/login', login);
userRouter.post('/register', register);
userRouter.post('/logout', logout);
userRouter.post('/refresh', refresh);
