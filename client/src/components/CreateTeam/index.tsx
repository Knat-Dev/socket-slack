import { Box, Button, Text } from '@chakra-ui/react';
import { randomBytes } from 'crypto';
import { Form, Formik } from 'formik';
import React, { FC } from 'react';
import { FormikInput } from '..';
import { useSocketContext } from '../../context';
import { useTeamsContext } from '../../context/Team';
import { Team } from '../../types';

interface Props {
  onClose?: () => void;
}

export const CreateTeam: FC<Props> = ({ onClose }) => {
  const [, dispatch] = useTeamsContext();
  const [{ teams }] = useTeamsContext();
  const [socket] = useSocketContext();

  return (
    <Box p={8}>
      <Text fontSize="2xl">
        CREATE YOUR {teams.length === 0 && 'FIRST'} TEAM
      </Text>
      <Formik
        initialValues={{ name: '' }}
        onSubmit={(values) => {
          if (values.name.trim()) {
            const team: Team = {
              _id: randomBytes(12).toString('hex'),
              name: values.name,
              channels: [],
            };
            dispatch({
              type: 'add_team',
              team,
            });
            socket?.emit('team_created', { team });
            onClose && onClose();
          }
        }}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <FormikInput
              name="name"
              label="Team Name"
              placeholder="Enter team name"
              autoComplete="off"
            />
            <Button
              type="submit"
              mt={2}
              w="100%"
              color="white"
              bgColor="purple.700"
              _hover={{ bgColor: 'purple.600' }}
              _active={{ bgColor: 'purple.500' }}
              _focus={{ outline: 'none' }}
            >
              CREATE
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};
