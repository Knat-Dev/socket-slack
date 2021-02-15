import { useEffect, useRef } from 'react';
import { useChannelContext, useSocketContext } from '../../../../../../context';

export const useTyping = (value: string) => {
  const [socket] = useSocketContext();
  const [{ id }] = useChannelContext();
  const typingRef = useRef(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    let isTyping = typingRef.current;

    if (value) {
      if (socket?.user) {
        if (!isTyping) {
          typingRef.current = true;
          socket?.emit('i_am_typing', { id });
        }
        timeout = setTimeout(() => {
          if (socket.user) {
            typingRef.current = false;
            socket?.emit('i_stopped_typing', { id });
          }
        }, 2000);
      }
    } else if (socket?.user && typingRef.current) {
      typingRef.current = false;
      socket?.emit('i_stopped_typing', { id });
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [value, socket, id]);
};
