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
              {selectedTeam.channels.map((channel) => (
                <ListItem
                  my="0.25rem"
                  as="button"
                  textAlign="left"
                  py="0.25rem"
                  w="100%"
                  px={2}
                  borderRadius={4}
                  key={channel._id}
                  backgroundColor={
                    selectedChannel?._id === channel._id
                      ? 'rgba(255,255,255,0.05)'
                      : undefined
                  }
                  _hover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                  cursor="pointer"
                  onClick={() => {
                    history.push(
                      `/dashboard/${selectedTeam._id}/${channel._id}`
                    );
                  }}
                  display="flex"
                >
                  <Box
                    w="100%"
                    maxW={225}
                    isTruncated
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    <Text as="span" mr={4}>
                      #
                    </Text>
                    {channel.name}
                  </Box>
                </ListItem>
              ))}
            </Box>
          </List>
        </Flex>
      </Grid>
      <TeamModal isOpen={isOpen} onClose={onClose} />
      <ChannelModal isOpen={channelIsOpen} onClose={channelOnClose} />
    </>
  );
};
