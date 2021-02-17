import { ChannelState } from '..';
import { Channel, User } from '../../../types';

export type Action =
  | { type: 'set_selected_channel'; channel: Channel }
  | { type: 'add_typing_user'; user: User }
  | { type: 'remove_typing_user'; user: User };

export const channelReducer = (
  state: ChannelState,
  action: Action
): ChannelState => {
  switch (action.type) {
    case 'set_selected_channel':
      return {
        ...state,
        selectedChannel: action.channel,
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
