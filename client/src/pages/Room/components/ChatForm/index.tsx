import { Box } from '@chakra-ui/react';
import { randomBytes } from 'crypto';
import { Form, Formik } from 'formik';
import React, { FC } from 'react';
import { useChannelContext, useSocketContext } from '../../../../context';
import { useChatContext } from '../../../../context/Chat';
import { Message } from '../../../../types';
import { Input } from './components';

export const ChatForm: FC = () => {
  const [socket] = useSocketContext();
  const [{ messages }, dispatch] = useChatContext();
  const [{ id }] = useChannelContext();

  return (
    <Formik
      initialValues={{ text: '' }}
      onSubmit={(values, { setFieldValue }) => {
        if (socket?.connected && socket.user && values.text.trim()) {
          const _id = randomBytes(12).toString('hex');
          const message: Message = {
            channelId: id,
            text: values.text,
            user: socket.user,
            optimisticId: _id,
          };
          setFieldValue('text', '');

          dispatch({
            type: 'set_messages',
            messages: [...messages, message],
          });
          socket.emit('message_from_client', message);
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
                placeholder={`Message #${id}`}
              />
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};
