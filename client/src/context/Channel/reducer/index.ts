import { Channel } from '..';
import { User } from '../../../types';

export type Action =
  | { type: 'set_channel_id'; id: string }
  | { type: 'add_typing_user'; user: User }
  | { type: 'remove_typing_user'; user: User };

export const channelReducer = (state: Channel, action: Action): Channel => {
  switch (action.type) {
    case 'set_channel_id':
      return {
        ...state,
        id: action.id,
      };
    case 'add_typing_user':
      return {
        ...state,
        typingUsers: [...state.typingUsers, action.user],
      };
    case 'remove_typing_user':
      return {
        ...state,
        typingUsers: state.typingUsers.filter(
          (user) => user._id !== action.user._id
        ),
      };
    default:
      return state;
  }
};
