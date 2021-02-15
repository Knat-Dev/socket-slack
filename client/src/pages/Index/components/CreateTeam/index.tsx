import { Box, Button, Text } from '@chakra-ui/react';
import { randomBytes } from 'crypto';
import { Form, Formik } from 'formik';
import React, { FC } from 'react';
import { FormikInput } from '../../../../components';
import { useSocketContext } from '../../../../context';
import { useTeamsContext } from '../../../../context/Team';
import { Team } from '../../../../types';

export const CreateTeam: FC = () => {
  const [, dispatch] = useTeamsContext();
  const [socket] = useSocketContext();

  return (
    <Box mx={4} p={4} borderRadius={5} boxShadow="0 0 8px 2px rgb(0 0 0 / 9%)">
      <Text fontSize="2xl">CREATE YOUR FIRST TEAM</Text>
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
              backgroundColor="purple.500"
              color="white"
            >
              CREATE
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};
