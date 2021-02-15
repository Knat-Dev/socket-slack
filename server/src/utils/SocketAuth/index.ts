import { verify } from 'jsonwebtoken';
import { UserModel } from '../../models';
import { Socket } from '../../types';

export const socketAuth = async (socket: Socket, next: any) => {
  const token = socket.handshake.query.token as string;

  try {
    const payload = verify(token, process.env.JWT_SECRET) as { id: string };
    socket.userId = payload.id;
    const user = await UserModel.findById(payload.id);

    if (user) {
      socket.user = user.toJSON();
      return next();
    }
  } catch (e) {
    return socket.disconnect();
  }
};
