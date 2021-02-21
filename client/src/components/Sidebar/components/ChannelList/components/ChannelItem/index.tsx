import { Box, ListItem, Text } from '@chakra-ui/react';
import React, { FC, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useUIContext } from '../../../../../../context';
import { Channel, Team } from '../../../../../../types';

interface Props {
  channel: Channel;
  selectedChannel: Channel;
  selectedTeam: Team;
}

export const ChannelItem: FC<Props> = ({
  channel,
  selectedChannel,
  selectedTeam,
}) => {
  const history = useHistory();
  const buttonRef = useRef<(HTMLLIElement & HTMLButtonElement) | null>(null);
  const [, uiDispatch, chatInputRef] = useUIContext();

  return (
    <ListItem
      ref={buttonRef}
      my="0.25rem"
      as="button"
      textAlign="left"
      py="0.25rem"
      w="100%"
      px={2}
      borderRadius={4}
      backgroundColor={
        selectedChannel?._id === channel._id
          ? 'rgba(255,255,255,0.05)'
          : undefined
      }
      _hover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
      cursor="pointer"
      onClick={(e) => {
        e.preventDefault();
        history.push(`/dashboard/${selectedTeam._id}/${channel._id}`);
        uiDispatch({ type: 'set_drawer_closed' });
        chatInputRef.current?.focus();
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
  );
};
