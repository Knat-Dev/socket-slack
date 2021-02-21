import React, { FC } from 'react';
import { Channel, Team } from '../../../../types';
import { ChannelItem } from './components';

interface Props {
  selectedTeam: Team;
  selectedChannel: Channel;
}

export const ChannelList: FC<Props> = ({ selectedTeam, selectedChannel }) => {
  return (
    <div>
      {selectedTeam.channels.map((channel) => (
        <ChannelItem
          key={channel._id}
          channel={channel}
          selectedChannel={selectedChannel}
          selectedTeam={selectedTeam}
        />
      ))}
    </div>
  );
};
