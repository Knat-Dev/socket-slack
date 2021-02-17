import { Team } from '../../../types';
import { refreshToken } from '../../../utils';
import { Action } from '../reducer';

export const setSelectedTeam = async (
  team: Team,
  dispatch: (value: Action) => void
) => {
  await refreshToken();
  dispatch({ type: 'set_selected_team', team });
};
