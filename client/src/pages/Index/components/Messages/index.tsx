import { Flex, List, Spinner, Text } from '@chakra-ui/react';
import { randomBytes } from 'crypto';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Waypoint } from 'react-waypoint';
import { useChannelContext, useSocketContext } from '../../../../context';
import { useChatContext } from '../../../../context/Chat';
import { useTeamsContext } from '../../../../context/Team';
import { Message } from '../../../../types';
import axios from '../../../../utils/axios';
import { MessageItem } from './components';

export const Messages: FC = () => {
  const [socket] = useSocketContext();
  const [{ selectedChannel }] = useChannelContext();
  const [{ socket: nspSocket }] = useTeamsContext();
  const [{ messages, loading }, dispatch] = useChatContext();
  const bottom = useRef<HTMLDivElement | null>(null);
  const hasMoreRef = useRef(false);
  const [hasMore, setHasMore] = useState(false);

  // Loading indicator when changing a channel
  useEffect(() => {
    dispatch({ type: 'set_messages_loading' });
  }, [selectedChannel, dispatch]);

  // fetch messages
  const fetchMessages = useCallback(
    async (cursor: string | null) => {
      if (selectedChannel) {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/chats/messages`,
          {
            params: {
              channelId: selectedChannel._id,
              cursor,
            },
          }
        );
        return res.data;
      }
    },
    [selectedChannel]
  );

  // Fetch messages on channel change
  useEffect(() => {
    hasMoreRef.current = false;
    setHasMore(false);

    (async () => {
      if (selectedChannel?._id) {
        const data = await fetchMessages(null);

        if (data.messages) {
          dispatch({ type: 'set_messages', messages: data.messages });
          if (data.hasMore) {
            hasMoreRef.current = true;
            setHasMore(true);
          }
        }
      }
    })();
  }, [dispatch, selectedChannel?._id, fetchMessages]);

  // Fetch more messages callback
  const fetchMoreMessages = useCallback(async () => {
    if (messages[0]._id) {
      const data = await fetchMessages(messages[0]._id);
      if (!data.hasMore) {
        hasMoreRef.current = false;
        setHasMore(false);
      }
      // dispatch pagination action here
      console.log('pagination..');
      dispatch({
        type: 'shift_message_history',
        messages: data.messages,
      });
    }
  }, [messages, fetchMessages, dispatch]);

  useEffect(() => {
    // New messages listener
    nspSocket?.on('new_message', (message: Message) => {
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

    // Message deleted listener
    nspSocket?.on('message_deleted', ({ id }: { id: string }) => {
      dispatch({ type: 'delete_message', messageId: id });
    });

    // Message edited listener
    nspSocket?.on(
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
      nspSocket?.off('new_message');
      nspSocket?.off('message_deleted');
      nspSocket?.off('message_edited');
    };
  }, [nspSocket, messages, dispatch]);

  // Handle message deletion
  const deleteMessage = (message: Message) => {
    const messageId = message._id;
    if (messageId && message.user._id === socket?.user?._id) {
      nspSocket?.emit('message_deleted', { id: messageId });
      dispatch({ type: 'delete_message', messageId });
    }
  };

  // Handle message edition
  const editMessage = (message: Message) => {
    console.log(message);
    const messageId = message._id;
    if (messageId && message.user._id === socket?.user?._id) {
      nspSocket?.emit('message_edited', { id: messageId, text: message.text });
      dispatch({
        type: 'edit_message',
        messageId,
        text: message.text,
      });
    }
  };

  // Message render function
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
    <>
      <List>
        {!hasMore && (
          <Text textAlign="center" py={2}>
            Chat began here..
          </Text>
        )}
        {messages.map((message, i) => {
          if (i === 13 && hasMore)
            return (
              <Waypoint
                key={message._id ?? randomBytes(12).toString('hex')}
                onEnter={() => {
                  setTimeout(() => {
                    fetchMoreMessages();
                  }, 0);
                }}
              >
                <div>{messageItem(message, i)}</div>
              </Waypoint>
            );
          else return messageItem(message, i);
        })}
        <div ref={bottom} />
      </List>
    </>
  );
};
