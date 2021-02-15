import { FC, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { LoadingScreen } from '../../components';
import { Layout } from '../../components/Layout';
import { useChannelContext, useSocketContext } from '../../context';
import { useTeamsContext } from '../../context/Team';
import { Team, User } from '../../types';
import { CreateTeam } from './components';

export const Index: FC<RouteComponentProps<{ teamId: string }>> = ({
  history,
  match,
}) => {
  const [socket] = useSocketContext();
  const [
    { teams, selectedTeam, socket: nspSocket },
    dispatch,
  ] = useTeamsContext();
  const [, channelDispatch] = useChannelContext();
  const [haveTeams, setHaveTeams] = useState(false);
  const [loading, setLoading] = useState(true);
  const { teamId } = match.params;

  // only run this useEffect hook after a user's teams have been obtained
  useEffect(() => {
    // Check if already got teams
    if (teams.length) {
      // >= 1
      if (teamId) {
        const teamIndex = teams.findIndex((team) => team._id === teamId);
        if (teamIndex !== -1)
          dispatch({ type: 'set_selected_team', team: teams[teamIndex] });
        if (teams[teamIndex] && teams[teamIndex].channels.length) {
          channelDispatch({
            type: 'set_channel_id',
            id: teams[teamIndex].channels[0]._id,
          });
          dispatch({ type: 'set_nsp', teamId: teams[teamIndex]._id });
          history.push(
            `/${teamId}/${(teams[teamIndex] as any).channels[0]._id}`
          );
        } else dispatch({ type: 'set_selected_team', team: teams[0] });
      }
    }
  }, [teamId, teams, dispatch, channelDispatch, history]);

  useEffect(() => {
    socket?.on('broadcast_me', async (user: User) => {
      if (user.teams.length) {
        dispatch({ type: 'set_teams', teams: user.teams });
        history.push(`/${user.teams[0]._id}`);
      }

      setLoading(false);
    });

    socket?.on('team_created', ({ newTeam }: { newTeam: Team }) => {
      const optimisticIdIndex = teams.findIndex(
        (team) => team._id === newTeam.optimisticId
      );

      // I didn't create this team, could not find a team already in state
      if (optimisticIdIndex === -1) {
        dispatch({ type: 'add_team', team: newTeam });
      } else {
        teams[optimisticIdIndex] = newTeam;
        dispatch({ type: 'set_teams', teams });
        history.push(`/${newTeam._id}`);
      }
    });

    if (teams.length) {
      setHaveTeams(true);
    } else setHaveTeams(false);
    return () => {
      socket?.off('broadcast_me');
      socket?.off('team_created');
    };
  }, [socket, teams, dispatch, history]);

  useEffect(() => {
    if (selectedTeam._id) {
      socket?.on('connect', () => {
        console.log('swap namespace');
      });
      return () => {
        socket?.off('connect');
      };
    }
  }, [socket, nspSocket, selectedTeam._id, dispatch]);

  if (loading) return <LoadingScreen />;
  return (
    <Layout middle={!haveTeams}>
      {haveTeams ? <div></div> : <CreateTeam />}
    </Layout>
  );
};
