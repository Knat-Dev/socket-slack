/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useContext, useState } from 'react';

interface Auth {
  loggedIn: boolean;
}

const initial = { loggedIn: false };

export const AuthContext = createContext<[Auth, (auth: Auth) => void]>([
  initial,
  () => {},
]);
export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider: React.FC = (props) => {
  const [authState, setAuthState] = useState(initial);
  const defaultAuthContext: [Auth, typeof setAuthState] = [
    authState,
    setAuthState,
  ];

  return (
    <AuthContext.Provider value={defaultAuthContext}>
      {props.children}
    </AuthContext.Provider>
  );
};
