import { Handler, NextFunction, Request, Response } from 'express';

export const logger: Handler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log(`${req.method} ${req.path}`);
  return next();
};
