import { ChakraProvider } from '@chakra-ui/react';
import React, { FC } from 'react';
import {
  AuthContextProvider,
  ChannelContextProvider,
  SocketContextProvider,
} from './context';
import { ChatContextProvider } from './context/Chat';
import { TeamContextProvider } from './context/Team';
import theme from './utils/theme';

const Providers: FC = ({ children }) => {
  return (
    <ChannelContextProvider>
      <ChatContextProvider>
        <SocketContextProvider>
          <TeamContextProvider>
            <AuthContextProvider>
              <ChakraProvider theme={theme}>{children}</ChakraProvider>
            </AuthContextProvider>
          </TeamContextProvider>
        </SocketContextProvider>
      </ChatContextProvider>
    </ChannelContextProvider>
  );
};
export default Providers;
