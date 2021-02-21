import {
  Box,
  Button,
  Flex,
  Grid,
  List,
  ListItem,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdAdd } from 'react-icons/md';
import { useChannelContext, useSocketContext } from '../../context';
import { useTeamsContext } from '../../context/Team';
import { IconButton } from '../IconButton';
import { ChannelList, ChannelModal, TeamList, TeamModal } from './components';

export const Sidebar = () => {
  const [{ selectedChannel }] = useChannelContext();
  const [{ selectedTeam, teams }] = useTeamsContext();
  const [socket] = useSocketContext();

  // Team Modal Disclosure
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Channel Modal Disclosure
  const {
    isOpen: channelIsOpen,
    onOpen: channelOnOpen,
    onClose: channelOnClose,
  } = useDisclosure();

  if (!socket?.user) return null;
  return (
    <>
      <Grid
        w={320}
        h="100%"
        templateColumns="60px auto"
        backgroundColor="rgba(0,0,0,0.15)"
      >
        <Flex
          flexDir="column"
          align="center"
          backgroundColor="rgba(0,0,0,0.15)"
          pt={2}
        >
          <TeamList teams={teams} selectedTeam={selectedTeam} />
          <Tooltip label="Create a new Team" placement="right">
            <Button
              display="flex"
              fontSize="24px"
              fontWeight={600}
              align="center"
              justify="center"
              h="50px"
              w="50px"
              borderRadius="50%"
              bgColor="purple.700"
              _hover={{ bgColor: 'purple.600', borderRadius: '25%' }}
              _active={{ bgColor: 'purple.500' }}
              onClick={onOpen}
            >
              <AiOutlinePlus />
            </Button>
          </Tooltip>
        </Flex>
        <Flex direction="column" pt={2}>
          <Box px={4} color="blue.400">
            {socket.user.name}
          </Box>
          <Box px={4}>
            Team Name:{' '}
            <Text as="span" color="blue.400">
              {selectedTeam.name}
            </Text>
          </Box>
          <List my={4}>
            <Box px={2} w="100%">
              <ListItem
                mb={1}
                px={2}
                display="flex"
                justifyContent="space-between"
                fontWeight={600}
              >
                <Text>Channels</Text>
                <IconButton
                  background="rgba(0,0,0,.2)"
                  label="Create Channel"
                  onClick={channelOnOpen}
                >
                  <MdAdd />
                </IconButton>
              </ListItem>
              <ChannelList
                selectedChannel={selectedChannel}
                selectedTeam={selectedTeam}
              />
            </Box>
          </List>
        </Flex>
      </Grid>
      <TeamModal isOpen={isOpen} onClose={onClose} />
      <ChannelModal isOpen={channelIsOpen} onClose={channelOnClose} />
    </>
  );
};
