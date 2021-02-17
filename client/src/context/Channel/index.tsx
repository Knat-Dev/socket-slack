import React, { createContext, useContext, useReducer } from 'react';
import { Channel, User } from '../../types';
import { Action, channelReducer } from './reducer';

export interface ChannelState {
  selectedChannel: Channel | null;
  typingUsers: Pick<User, '_id' | 'name'>[];
}

const initial: ChannelState = {
  selectedChannel: null,
  typingUsers: [],
};

export const ChannelContext = createContext<
  [ChannelState, React.Dispatch<Action>]
>([initial, () => {}]);
export const useChannelContext = () => useContext(ChannelContext);

export const ChannelContextProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(channelReducer, initial);
  const defaultChannelContext: [ChannelState, typeof dispatch] = [
    state,
    dispatch,
  ];

  return (
    <ChannelContext.Provider value={defaultChannelContext}>
      {props.children}
    </ChannelContext.Provider>
  );
};
