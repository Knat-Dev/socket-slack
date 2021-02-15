import { Box, Button, Text } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { FC, useCallback } from 'react';
import { useBeforeunload } from 'react-beforeunload';
import { RouteComponentProps } from 'react-router-dom';
import { FormikInput } from '../../components';
import { Layout } from '../../components/Layout';
import { useChannelContext, useSocketContext } from '../../context';

export const Index: FC<RouteComponentProps> = ({ history }) => {
  const [socket] = useSocketContext();
  const [, dispatch] = useChannelContext();

  // Handle page refresh while connected to socket
  const onRefreshedPage = useCallback(() => {
    if (socket) {
      socket.emit('refresh_page');
      socket.disconnect();
    }
  }, [socket]);
  useBeforeunload(onRefreshedPage);

  return (
    <Layout middle>
      <Box
        mx={4}
        p={4}
        borderRadius={5}
        boxShadow="0 0 8px 2px rgb(0 0 0 / 9%)"
      >
        <Text fontSize="2xl">CREATE CHAT ROOM</Text>
        <Formik
          initialValues={{ id: '' }}
          onSubmit={(values) => {
            if (values.id.trim()) {
              history.push(`/room/${values.id}`);
              dispatch({ type: 'set_channel_id', id: values.id });
            }
          }}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <FormikInput
                name="id"
                label="Room Name"
                placeholder="Enter room name"
                autoComplete="off"
              />
              <Button type="submit" mt={2} w="100%" colorScheme="purple">
                CREATE
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Layout>
  );
};
