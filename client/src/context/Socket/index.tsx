import React, { useContext, useEffect, useState } from 'react';
import { io, Socket as SocketIo } from 'socket.io-client';
import { useChannelContext } from '..';
import { User } from '../../types';
import { getAccessToken, refreshToken } from '../../utils';
import toast from '../../utils/toast';
export const getSocket = async () => {
  console.log('Getting a new socket..');
  try {
    await refreshToken();
    const token = getAccessToken();
    if (token) {
      return io('ws://localhost:5000', {
        query: { token },
      });
    }
  } catch (e) {
    console.log(e);
  }

  return null;
};

export interface Socket extends SocketIo {
  user?: User;
}

export const SocketContext = React.createContext<
  [Socket | null, (socket: Socket | null) => void]
>([null, () => {}]);

export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider: React.FC = (props) => {
  const [socketState, setSocketState] = useState<Socket | null>(null);
  const [, dispatch] = useChannelContext();
  const defaultSocketContext: [Socket | null, typeof setSocketState] = [
    socketState,
    setSocketState,
  ];

  // global events are handled here
  useEffect(() => {
    socketState?.on('connect', () => {
      toast({
        position: 'top-right',
        isClosable: true,
        title: 'Connected!',
        description: 'You have been connected successfully!',
        status: 'success',
      });
    });

    socketState?.on('user_typing', (user: User) => {
      dispatch({ type: 'add_typing_user', user });
    });

    socketState?.on('user_stopped_typing', (user: User) => {
      dispatch({ type: 'remove_typing_user', user });
    });

    socketState?.on('broadcast_me', (user: User) => {
      // setup the user object on the socket itself in the beginning of the session
      socketState.user = user;
      setSocketState(socketState);
    });

    return () => {
      socketState?.off('broadcast_me');
      socketState?.off('user_typing');
      socketState?.off('user_stopped_typing');
      socketState?.off('connect');
      socketState?.off('disconnect');
    };
  }, [socketState, dispatch]);

  return (
    <SocketContext.Provider value={defaultSocketContext}>
      {props.children}
    </SocketContext.Provider>
  );
};
