import { useEffect, useRef } from 'react';
import { useChannelContext, useSocketContext } from '../../../../../../context';
import { useTeamsContext } from '../../../../../../context/Team';

export const useTyping = (value: string) => {
  const [socket] = useSocketContext();
  const [{ selectedChannel }] = useChannelContext();
  const [{ socket: nspSocket }] = useTeamsContext();
  const typingRef = useRef(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    let isTyping = typingRef.current;

    if (value) {
      if (socket?.user) {
        if (!isTyping) {
          typingRef.current = true;
          nspSocket?.emit('user_typing', { id: selectedChannel?._id });
        }
        timeout = setTimeout(() => {
          if (socket.user) {
            typingRef.current = false;
            nspSocket?.emit('i_stopped_typing', { id: selectedChannel?._id });
          }
        }, 2000);
      }
    } else if (socket?.user && typingRef.current) {
      typingRef.current = false;
      nspSocket?.emit('i_stopped_typing', { id: selectedChannel?._id });
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [value, socket, nspSocket, selectedChannel]);
};
