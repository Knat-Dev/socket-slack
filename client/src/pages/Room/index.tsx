import { Box, Flex, Text } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { FC, useCallback, useEffect } from 'react';
import { useBeforeunload } from 'react-beforeunload';
import { RouteComponentProps } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { useChannelContext, useSocketContext } from '../../context';
import { handleOffline } from '../../utils';
import { ChatForm } from './components';
import { Messages } from './components/Messages';

export const Room: FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  const id = match.params.id;
  const [socket] = useSocketContext();
  const [{ typingUsers }, dispatch] = useChannelContext();

  // Handle page refresh while still connected to socket
  const onRefreshedPage = useCallback(() => {
    handleOffline(socket, id);
  }, [socket, id]);
  useBeforeunload(onRefreshedPage);

  const onConnect = useCallback(() => {
    console.log('connected!');
    socket?.emit('join_room', { id });
  }, [socket, id]);

  useEffect(() => {
    dispatch({ type: 'set_channel_id', id });
    socket?.emit('join_room', { id });

    return () => {
      // for navigation which is different from refresh
      handleOffline(socket, id);
    };
  }, [id, socket, dispatch, onConnect]);

  if (!socket) return null;
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

  return (
    <Layout>
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
    </Layout>
  );
};
