import { Socket } from '../../context';

export const handleOffline = (socket: Socket | null, channelId: string) => {
  socket?.emit('leave_room', { id: channelId });
  socket?.emit('i_stopped_typing', { id: channelId });
};
