import { Box } from '@chakra-ui/react';
import { randomBytes } from 'crypto';
import { Form, Formik } from 'formik';
import React, { FC } from 'react';
import { useChannelContext, useSocketContext } from '../../../../context';
import { useChatContext } from '../../../../context/Chat';
import { useTeamsContext } from '../../../../context/Team';
import { Message } from '../../../../types';
import { Input } from './components';

export const ChatForm: FC = () => {
  const [socket] = useSocketContext();
  const [{ socket: nspSocket }] = useTeamsContext();
  const [{ messages }, dispatch] = useChatContext();
  const [{ selectedChannel }] = useChannelContext();

  return (
    <Formik
      initialValues={{ text: '' }}
      onSubmit={(values, { setFieldValue }) => {
        if (
          socket?.connected &&
          socket.user &&
          values.text.trim() &&
          selectedChannel
        ) {
          const _id = randomBytes(12).toString('hex');
          const message: Message = {
            channelId: selectedChannel._id,
            text: values.text,
            user: socket.user,
            optimisticId: _id,
          };
          setFieldValue('text', '');

          dispatch({
            type: 'set_messages',
            messages: [...messages, message],
          });
          nspSocket?.emit('new_message', message);
        }
      }}
    >
      {({ handleSubmit }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <Box mt={1}>
              <Input
                autoFocus
                autoComplete="off"
                h="30px"
                name="text"
                placeholder={`Message #${selectedChannel?.name}`}
              />
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};
