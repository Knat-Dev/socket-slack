import { Handler, NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { Request } from '../../types';

export const isAuthorized: Handler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  } else {
    try {
      const payload = verify(token, process.env.JWT_SECRET) as { id: string };
      req.payload = payload;
      return next();
    } catch (e) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
};
