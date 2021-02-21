import { Button, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { useUIContext } from '../../../../context';
import { Team } from '../../../../types';

interface Props {
  teams: Team[];
  selectedTeam: Team;
}

export const TeamList: FC<Props> = ({ teams, selectedTeam }) => {
  const history = useHistory();
  const [, , chatInputRef] = useUIContext();

  return (
    <div>
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
              if (selectedTeam._id !== team._id) {
                history.push(`/dashboard/${team._id}/${team.channels[0]._id}`);
              }
              chatInputRef.current?.focus();
            }}
          >
            {team.name.substr(0, 1).toUpperCase()}
          </Button>
        </Tooltip>
      ))}
    </div>
  );
};
