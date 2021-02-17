import { io } from 'socket.io-client';
import { Teams } from '..';
import { Channel, Team } from '../../../types';
import { getAccessToken } from '../../../utils';

export type Action =
  | {
      type: 'set_selected_team';
      team: Team;
    }
  | {
      type: 'add_team';
      team: Team;
    }
  | {
      type: 'set_teams';
      teams: Team[];
    }
  | {
      type: 'add_channel';
      channel: Channel;
    };

export const teamsReducer = (state: Teams, action: Action): Teams => {
  switch (action.type) {
    case 'set_selected_team': {
      // start off by setting the namespace connection
      state.socket?.disconnect();
      const token = getAccessToken();
      if (!token) return state;
      return {
        ...state,
        selectedTeam: action.team,
        socket: io(`ws://localhost:5000/${action.team._id}`, {
          query: { token },
        }),
      };
    }
    case 'add_team': {
      return {
        ...state,
        teams: [...state.teams, action.team],
      };
    }
    case 'set_teams':
      return {
        ...state,
        teams: action.teams,
      };
    case 'add_channel': {
      const teams = [...state.teams];
      const teamIndex = teams.findIndex(
        (team) => team._id === action.channel.teamId
      );
      if (teamIndex !== -1) {
        teams[teamIndex].channels = [
          ...teams[teamIndex].channels,
          action.channel,
        ];
      }
      return {
        ...state,
        teams,
      };
    }
    default:
      return state;
  }
};
