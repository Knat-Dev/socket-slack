import { Box, Flex, Text } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { FC, useEffect, useState } from 'react';
import { useBeforeunload } from 'react-beforeunload';
import { RouteComponentProps } from 'react-router-dom';
import { LoadingScreen } from '../../components';
import { CreateTeam } from '../../components/';
import { Layout } from '../../components/Layout';
import { useChannelContext, useSocketContext } from '../../context';
import { useTeamsContext } from '../../context/Team';
import { setSelectedTeam } from '../../context/Team/actions';
import { Channel, Team, User } from '../../types';
import { ChatForm } from './components';
import { Messages } from './components/Messages';

export const Index: FC<
  RouteComponentProps<{ teamId: string; channelId: string }>
> = ({ history, match }) => {
  const [socket] = useSocketContext();
  const [
    { teams, selectedTeam, socket: nspSocket },
    dispatch,
  ] = useTeamsContext();
  const [
    { selectedChannel, typingUsers },
    channelDispatch,
  ] = useChannelContext();
  const [haveTeams, setHaveTeams] = useState(false);
  const [loading, setLoading] = useState(true);
  const { teamId, channelId } = match.params;
  useBeforeunload(async () => {
    if (selectedChannel)
      nspSocket?.emit('leave_channel', {
        id: selectedChannel._id,
        teamId: selectedTeam._id,
      });
    nspSocket?.disconnect();
  });

  // only run this useEffect hook after a user's teams have been obtained
  // selects the team and the channel for the global state
  useEffect(() => {
    // Check if already got teams
    if (teams.length) {
      // >= 1
      if (!teamId)
        history.push(`/dashboard/${teams[0]._id}/${teams[0].channels[0]._id}`);
      if (teamId && !channelId) {
        const teamIndex = teams.findIndex((team) => team._id === teamId);
        if (teams[teamIndex])
          history.push(
            `/dashboard/${teams[teamIndex]._id}/${teams[teamIndex].channels[0]._id}`
          );
        else
          history.push(
            `/dashboard/${teams[0]._id}/${teams[0].channels[0]._id}`
          );
      } else if (teamId && channelId && channelId !== selectedChannel?._id) {
        const teamIndex = teams.findIndex((team) => team._id === teamId);
        if (teamIndex !== -1) {
          // team was found
          setSelectedTeam(teams[teamIndex], dispatch); // refresh the access token and create a new socket
          if (channelId) {
            const channelIndex = teams[teamIndex].channels.findIndex(
              (channel) => channel._id === channelId
            );
            if (channelIndex !== -1) {
              channelDispatch({
                type: 'set_selected_channel',
                channel: teams[teamIndex].channels[channelIndex],
              });
            } else {
              history.push(
                `/dashboard/${teams[teamIndex]._id}/${teams[teamIndex].channels[0]._id}`
              );
            }
          }
        } else if (teams[teamIndex] && teams[teamIndex].channels.length) {
          channelDispatch({
            type: 'set_selected_channel',
            channel: teams[teamIndex].channels[0],
          });
        } else if (teams[teamIndex]) {
          dispatch({ type: 'set_selected_team', team: teams[0] });
          channelDispatch({
            type: 'set_selected_channel',
            channel: teams[teamIndex].channels[0],
          });
        }
      }
    }
  }, [
    teamId,
    channelId,
    teams,
    selectedTeam,
    dispatch,
    channelDispatch,
    history,
    selectedChannel,
  ]);

  // emit join channel when socket connects
  useEffect(() => {
    nspSocket?.on('connect', () => {
      nspSocket?.emit('join_channel', {
        id: selectedChannel?._id,
        teamId: selectedChannel?.teamId,
      });
    });
  }, [nspSocket, selectedChannel]);

  useEffect(() => {
    nspSocket?.on('channel_created', (newChannel: Channel) => {
      const optimisticIdIndex = selectedTeam.channels.findIndex(
        (channel) => channel._id === newChannel.optimisticId
      );
      console.log(optimisticIdIndex);
      if (optimisticIdIndex === -1) {
        dispatch({ type: 'add_channel', channel: newChannel });
      } else {
        const newTeam = { ...selectedTeam };
        newTeam.channels[optimisticIdIndex] = newChannel;
        dispatch({ type: 'set_selected_team', team: newTeam });
        history.push(`/dashboard/${newChannel.teamId}/${newChannel._id}`);
      }
      // const teamIndex = [...teams].findIndex(
      //   (team) => team._id === selectedTeam._id
      // );
      // if (teamIndex !== -1) {
      //   teams[teamIndex] = newTeam;
      //   dispatch({ type: 'set_teams', teams });
      // }
    });

    return () => {
      nspSocket?.off('connect');
    };
  }, [nspSocket, history, selectedTeam, dispatch]);

  useEffect(() => {
    socket?.on('broadcast_me', async (user: User) => {
      if (user.teams.length) {
        dispatch({ type: 'set_teams', teams: user.teams });
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
        history.push(`/dashboard/${newTeam._id}/${newTeam.channels[0]._id}`);
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

  const typingUsersCopy = [...typingUsers];
  const typingUsersString =
    typingUsers.length !== 1 ? (
      <>
        <Text as="span" color="purple.400">
          {typingUsersCopy
            .splice(0, typingUsers.length - 1)
            .map((user) => user.name)
            .join(', ')}
        </Text>
        <Text as="span"> and </Text>
        <Text as="span" color="purple.400">
          {typingUsersCopy[typingUsersCopy.length - 1] &&
            typingUsersCopy[typingUsersCopy.length - 1].name}
        </Text>
        <Text as="span" color="gray.400">
          {' are typing'}
        </Text>
      </>
    ) : typingUsersCopy && typingUsersCopy.length > 0 ? (
      <Box color="purple.400">
        <Text as="span">{typingUsersCopy[0].name}</Text>
        <Text as="span" color="gray.400">
          {' is typing'}
        </Text>
      </Box>
    ) : null;

  if (loading) return <LoadingScreen />;
  return (
    <Layout middle={!haveTeams}>
      {haveTeams ? (
        <Flex h="100%" direction="column" w="100%">
          <Flex
            mr={1}
            grow={1}
            direction="column-reverse"
            overflow="auto"
            css={{
              '&::-webkit-scrollbar': {
                width: 8,
              },
              '&::-webkit-scrollbar-track': {
                width: 8,
                backgroundColor: 'rgba(0,0,0,0.1)',
                borderRadius: 8,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: 8,
                minHeight: 40,
              },
            }}
          >
            <Messages />
          </Flex>
          <Flex direction="column" mx={2}>
            <ChatForm />
            {/* Typing Users */}
            <Box fontSize="md" color="gray.500" h={6}>
              <AnimatePresence>
                {Object.keys(typingUsers).length > 0 && (
                  <Box
                    as={motion.div}
                    h={6}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                  >
                    {typingUsersString}
                  </Box>
                )}
              </AnimatePresence>
            </Box>
          </Flex>
        </Flex>
      ) : (
        <CreateTeam />
      )}
    </Layout>
  );
};
