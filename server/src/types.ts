import { mongoose } from '@typegoose/typegoose';
import { Request as ExpressRequest } from 'express';
import { Socket as IOSocket } from 'socket.io';
import { User } from './models';

export interface Request<T = any> extends ExpressRequest {
  body: T;
  payload?: { id: string };
}
export interface Socket extends IOSocket {
  userId?: string;
  user?: User | null;
}
export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type ChatRoomInput = {
  name: string;
};

export type ObjectId = mongoose.Types.ObjectId;
