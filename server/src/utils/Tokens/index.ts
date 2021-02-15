import { DocumentType } from '@typegoose/typegoose';
import { Response } from 'express';
import { sign } from 'jsonwebtoken';
import { User } from '../../models';

export const createAccessToken = (user: DocumentType<User>): string => {
  return sign({ id: user.id }, `${process.env.JWT_SECRET}`, {
    expiresIn: '15m',
  });
};

export const createRefreshToken = (user: DocumentType<User>): string => {
  return sign({ id: user.id }, `${process.env.JWT_REFRESH_SECRET}`, {
    expiresIn: '7d',
  });
};

export const sendRefreshToken = (res: Response, token: string): void => {
  if (res['cookie'])
    res.cookie('socket_cookie', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      domain: process.env.NODE_ENV === 'production' ? '.knat.dev' : 'localhost',
    });
};
