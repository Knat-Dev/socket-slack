import { io } from 'socket.io-client';
import { Teams } from '..';
import { Team } from '../../../types';
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
      type: 'set_nsp';
      teamId: string;
    };

export const teamsReducer = (state: Teams, action: Action): Teams => {
  switch (action.type) {
    case 'set_selected_team':
      return {
        ...state,
        selectedTeam: action.team,
      };
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
    case 'set_nsp': {
      state.socket?.disconnect();
      const token = getAccessToken();
      if (!token) return state;
      return {
        ...state,
        socket: io(`ws://localhost:5000/${action.teamId}`, {
          query: { token },
        }),
      };
    }
    default:
      return state;
  }
};
