import { Chat } from '..';
import { Message } from '../../../types';

export type Action =
  | { type: 'set_messages_loading' }
  | { type: 'set_messages'; messages: Message[] }
  | { type: 'shift_message_history'; messages: Message[] }
  | { type: 'delete_message'; messageId: string }
  | { type: 'edit_message'; messageId: string; text: string };

export const chatReducer = (state: Chat, action: Action): Chat => {
  switch (action.type) {
    case 'set_messages_loading':
      return {
        ...state,
        loading: true,
      };
    case 'set_messages':
      return {
        ...state,
        messages: action.messages,
        loading: false,
      };
    case 'shift_message_history':
      return {
        ...state,
        messages: [...action.messages, ...state.messages],
      };
    case 'delete_message':
      return {
        ...state,
        messages: state.messages.filter(
          (message) => message._id !== action.messageId
        ),
      };
    case 'edit_message': {
      const messageIndex = state.messages.findIndex(
        (message) => message._id === action.messageId
      );
      state.messages[messageIndex].text = action.text;
      return {
        ...state,
        messages: state.messages,
      };
    }

    default:
      return state;
  }
};
