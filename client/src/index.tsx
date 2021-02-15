import {
  ChakraProvider,
  ColorModeScript,
  Flex,
  Spinner,
} from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  AuthContextProvider,
  ChannelContextProvider,
  SocketContextProvider,
  useAuthContext,
} from './context';
import { ChatContextProvider } from './context/Chat';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Router from './router/Router';
import { setAccessToken } from './utils';
import theme from './utils/theme';

const App: FC = () => {
  const [loading, setLoading] = useState(true);
  const [, setAuthState] = useAuthContext();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/users/refresh`, {
      credentials: 'include',
      method: 'POST',
    })
      .then(async (res) => {
        const data = await res.json();
        const { accessToken } = data;
        setAccessToken(accessToken);
        if (accessToken) {
          setAuthState({ loggedIn: true });
        }
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [setAuthState]);

  if (loading)
    return (
      <Flex h="100vh" justify="center" align="center">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  return <Router />;
};

ReactDOM.render(
  <ChannelContextProvider>
    <ChatContextProvider>
      <SocketContextProvider>
        <AuthContextProvider>
          <ChakraProvider theme={theme}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <App />
          </ChakraProvider>
        </AuthContextProvider>
      </SocketContextProvider>
    </ChatContextProvider>
  </ChannelContextProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
