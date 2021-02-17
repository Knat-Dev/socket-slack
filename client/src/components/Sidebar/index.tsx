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
import { useHistory } from 'react-router-dom';
import { useChannelContext, useSocketContext } from '../../context';
import { useTeamsContext } from '../../context/Team';
import { IconButton } from '../IconButton';
import { ChannelModal, TeamModal } from './components';

export const Sidebar = () => {
  const [{ selectedChannel }] = useChannelContext();
  const [{ selectedTeam, teams }] = useTeamsContext();
  const [socket] = useSocketContext();
  const history = useHistory();

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
      <Grid w={320} h="100%" templateColumns="60px auto">
        <Flex
          flexDir="column"
          align="center"
          backgroundColor="rgba(0,0,0,0.2)"
          pt={2}
        >
          {teams.map((team) => (
            <Tooltip key={team._id} label={team.name} placement="right">
              <Button
                display="flex"
                align="center"
                justify="center"
                h="48px"
                w="48px"
                borderRadius="50%"
                bgColor="blue.700"
                mb={2}
                backgroundColor={
                  selectedTeam._id === team._id ? 'blue.500' : undefined
                }
                _hover={{ bgColor: 'blue.600', borderRadius: '25%' }}
                _active={{ bgColor: 'blue.500' }}
                _focus={{ outline: 'none' }}
                onClick={async () => {
                  if (selectedTeam._id !== team._id)
                    history.push(
                      `/dashboard/${team._id}/${team.channels[0]._id}`
                    );
                }}
              >
                {team.name.substr(0, 1).toUpperCase()}
              </Button>
            </Tooltip>
          ))}
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
              _focus={{ outline: 'none' }}
              onClick={onOpen}
            >
              <AiOutlinePlus />
            </Button>
          </Tooltip>
        </Flex>
        <Flex direction="column">
          <Box pt={2} px={2} color="blue.400">
            {socket.user.name}
          </Box>
          <Box px={2}>
            Team Name{' '}
            <Text as="span" color="blue.400">
              {selectedTeam.name}
            </Text>
          </Box>
          <List my={4}>
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
            {selectedTeam.channels.map((channel) => (
              <ListItem
                w="260px"
                py="0.25rem"
                px={2}
                key={channel._id}
                isTruncated
                overflow="hidden"
                textOverflow="ellipsis"
                transition="background-color 0.2s cubic-bezier(0.11, 0.44, 0.81, 0.43)"
                backgroundColor={
                  selectedChannel?._id === channel._id
                    ? 'rgba(0,0,0,0.2)'
                    : undefined
                }
                _hover={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                cursor="pointer"
                onClick={() => {
                  history.push(`/dashboard/${selectedTeam._id}/${channel._id}`);
                }}
              >
                <Text as="span" mr={4}>
                  #
                </Text>
                {channel.name}
              </ListItem>
            ))}
          </List>
        </Flex>
      </Grid>
      <TeamModal isOpen={isOpen} onClose={onClose} />
      <ChannelModal isOpen={channelIsOpen} onClose={channelOnClose} />
    </>
  );
};
