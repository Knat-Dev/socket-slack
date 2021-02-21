import { Router } from 'express';
import { getInviteLink } from '../controllers';
import { isAuthorized } from '../middleware';

export const teamRouter = Router();

teamRouter.get('/getInviteCode', isAuthorized, getInviteLink);
