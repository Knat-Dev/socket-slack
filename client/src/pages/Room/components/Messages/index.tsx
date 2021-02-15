import { Flex, List, Spinner, Text } from '@chakra-ui/react';
import { randomBytes } from 'crypto';
import React, { FC, useEffect, useState } from 'react';
import { Waypoint } from 'react-waypoint';
import { useChannelContext, useSocketContext } from '../../../../context';
import { useChatContext } from '../../../../context/Chat';
import { Message } from '../../../../types';
import axios from '../../../../utils/axios';
import { MessageItem } from './components';

export const Messages: FC = () => {
  const [socket] = useSocketContext();
  const [{ id }] = useChannelContext();
  const [{ messages, loading }, dispatch] = useChatContext();
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API}/chats/messages`,
        {
          params: {
            channelId: id,
            cursor,
          },
        }
      );

      if (res.data.messages && !cursor) {
        dispatch({ type: 'set_messages', messages: res.data.messages });
        if (res.data.hasMore) setHasMore(true);
      } else if (res.data.messages && cursor) {
        if (!res.data.hasMore) setHasMore(false);
        // dispatch pagination action here
        console.log('pagination..');
        dispatch({
          type: 'shift_message_history',
          messages: res.data.messages,
        });
      }
    })();
  }, [id, dispatch, cursor]);

  useEffect(() => {
    socket?.on('message_from_server', (message: Message) => {
      const optimisticUpdateMessageId = messages.findIndex(
        (optimisticMessage) =>
          optimisticMessage.optimisticId === message.optimisticId
      );
      console.log(optimisticUpdateMessageId);
      // did not find a message to update (it is not "my" message)
      if (optimisticUpdateMessageId === -1)
        dispatch({
          type: 'set_messages',
          messages: [...messages, message],
        });
      else {
        messages[optimisticUpdateMessageId] = message;
        dispatch({ type: 'set_messages', messages });
      }
    });

    socket?.on('message_deleted', ({ id }: { id: string }) => {
      dispatch({ type: 'delete_message', messageId: id });
    });

    socket?.on(
      'message_edited',
      ({ id, text }: { id: string; text: string }) => {
        dispatch({
          type: 'edit_message',
          messageId: id,
          text,
        });
      }
    );

    return () => {
      socket?.off('message_from_server');
      socket?.off('message_deleted');
      socket?.off('message_edited');
    };
  }, [socket, messages, dispatch]);

  const deleteMessage = (message: Message) => {
    const messageId = message._id;
    if (messageId && message.user._id === socket?.user?._id) {
      socket?.emit('message_deleted', { id: messageId });
      dispatch({ type: 'delete_message', messageId });
    }
  };

  const editMessage = (message: Message) => {
    console.log(message);
    const messageId = message._id;
    if (messageId && message.user._id === socket?.user?._id) {
      socket?.emit('message_edited', { id: messageId, text: message.text });
      dispatch({
        type: 'edit_message',
        messageId,
        text: message.text,
      });
    }
  };

  const messageItem = (message: Message, i: number) => (
    <MessageItem
      key={message._id ?? randomBytes(12).toString('hex')}
      message={message}
      isNotPreviousMessageOwner={
        i === 0 || message.user._id !== messages[i - 1].user._id
      }
      deleteMessage={deleteMessage}
      editMessage={editMessage}
    />
  );

  return loading ? (
    <Flex flexDir="column" h="100%" grow={1} align="center" justify="center">
      <Spinner size="xl" color="purple.500" />
    </Flex>
  ) : (
    <List>
      {!hasMore && (
        <Text textAlign="center" py={2}>
          Chat began here..
        </Text>
      )}
      {messages.map((message, i) => {
        if (i === 10 && hasMore)
          return (
            <Waypoint
              key={message._id ?? randomBytes(12).toString('hex')}
              onEnter={() => {
                if (messages[0]._id) setCursor(messages[0]._id);
              }}
            >
              <div>{messageItem(message, i)}</div>
            </Waypoint>
          );
        else return messageItem(message, i);
      })}
    </List>
  );
};
