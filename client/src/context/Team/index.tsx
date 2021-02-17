import React, { createContext, useContext, useReducer } from 'react';
import { Team } from '../../types';
import { Socket } from '../Socket';
import { Action, teamsReducer } from './reducer';

export interface Teams {
  selectedTeam: Team;
  teams: Team[];
  socket: Socket | null;
}

const initial: Teams = {
  selectedTeam: { _id: '', name: '', channels: [] },
  teams: [],
  socket: null,
};

export const TeamsContext = createContext<[Teams, React.Dispatch<Action>]>([
  initial,
  () => {},
]);
export const useTeamsContext = () => useContext(TeamsContext);

export const TeamContextProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(teamsReducer, initial);
  const defaultTeamContext: [Teams, typeof dispatch] = [state, dispatch];

  return (
    <TeamsContext.Provider value={defaultTeamContext}>
      {props.children}
    </TeamsContext.Provider>
  );
};
