import React, { createContext, useContext, useReducer } from 'react';
import { User } from '../../types';
import { Action, channelReducer } from './reducer';

export interface Channel {
  id: string;
  typingUsers: Pick<User, '_id' | 'name'>[];
}

const initial: Channel = {
  id: '',
  typingUsers: [],
};

export const ChannelContext = createContext<[Channel, React.Dispatch<Action>]>([
  initial,
  () => {},
]);
export const useChannelContext = () => useContext(ChannelContext);

export const ChannelContextProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(channelReducer, initial);
  const defaultChannelContext: [Channel, typeof dispatch] = [state, dispatch];

  return (
    <ChannelContext.Provider value={defaultChannelContext}>
      {props.children}
    </ChannelContext.Provider>
  );
};
