import React, { FC } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAuthContext } from '../../../context';

export const PublicRoute: FC<RouteProps> = (props) => {
  const [authState] = useAuthContext();

  if (authState.loggedIn) {
    const Component = () => <Redirect to="/" />;
    return <Route {...props} component={Component} />;
  }
  return <Route {...props} />;
};
