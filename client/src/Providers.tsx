import { ChakraProvider } from '@chakra-ui/react';
import React, { FC } from 'react';
import {
  AuthContextProvider,
  ChannelContextProvider,
  ChatContextProvider,
  SocketContextProvider,
  TeamContextProvider,
  UIContextProvider,
} from './context';
import theme from './utils/theme';

const Providers: FC = ({ children }) => {
  return (
    <UIContextProvider>
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
    </UIContextProvider>
  );
};
export default Providers;
