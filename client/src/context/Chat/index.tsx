import React, { createContext, useContext, useReducer } from 'react';
import { Message } from '../../types';
import { Action, chatReducer } from './reducer';

export interface Chat {
  messages: Message[];
  loading: boolean;
}

const initial: Chat = { messages: [], loading: true };

export const ChatContext = createContext<[Chat, React.Dispatch<Action>]>([
  initial,
  () => {},
]);
export const useChatContext = () => useContext(ChatContext);

export const ChatContextProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(chatReducer, initial);
  const defaultChatContext: [Chat, typeof dispatch] = [state, dispatch];

  return (
    <ChatContext.Provider value={defaultChatContext}>
      {props.children}
    </ChatContext.Provider>
  );
};
