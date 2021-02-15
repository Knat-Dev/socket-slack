import { Socket } from '../../types';

export const joinChannel = (socket: Socket, { id }: { id: string }) => {
  if (!socket.rooms.has(id)) {
    console.log('Joined Room: ' + id);
    socket.join(id);
  }
};
