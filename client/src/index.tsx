import { ColorModeScript } from '@chakra-ui/react';
import React, { FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { LoadingScreen } from './components';
import { useAuthContext } from './context';
import './index.css';
import Providers from './Providers';
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

  if (loading) return <LoadingScreen />;
  return <Router />;
};

ReactDOM.render(
  <Providers>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
  </Providers>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
