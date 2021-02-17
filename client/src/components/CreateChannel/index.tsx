import { Box, Button, Text } from '@chakra-ui/react';
import { randomBytes } from 'crypto';
import { Form, Formik } from 'formik';
import React, { FC } from 'react';
import { FormikInput } from '..';
import { useTeamsContext } from '../../context/Team';
import { Channel } from '../../types';

interface Props {
  onClose?: () => void;
}

export const CreateChannel: FC<Props> = ({ onClose }) => {
  const [{ selectedTeam, socket }, dispatch] = useTeamsContext();

  return (
    <Box p={8}>
      <Text fontSize="2xl">CREATE YOUR CHANNEL</Text>
      <Formik
        initialValues={{ name: '' }}
        onSubmit={(values) => {
          if (values.name.trim()) {
            const channel: Channel = {
              _id: randomBytes(12).toString('hex'),
              name: values.name,
              teamId: selectedTeam._id,
            };
            dispatch({
              type: 'add_channel',
              channel,
            });
            socket?.emit('channel_created', channel);
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
