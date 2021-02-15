import { Box, Flex, ListItem, Text, useColorModeValue } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { FC, MouseEvent, useState } from 'react';
import { HiEmojiHappy } from 'react-icons/hi';
import { MdDelete, MdEdit } from 'react-icons/md';
import { FormikInput, IconButton } from '../../../../../../components';
import { useSocketContext } from '../../../../../../context';
import { Message } from '../../../../../../types';

type HoverEvent = MouseEvent<HTMLLIElement, globalThis.MouseEvent>;
interface Props {
  message: Message;
  isNotPreviousMessageOwner: boolean;
  deleteMessage: (message: Message) => void;
  editMessage: (message: Message) => void;
}

export const MessageItem: FC<Props> = ({
  message,
  isNotPreviousMessageOwner,
  deleteMessage,
  editMessage,
}) => {
  const [socket] = useSocketContext();
  const [beingHovered, setBeingHovered] = useState(false);
  const [editingMode, setEditingMode] = useState(false);
  const usernameColor = useColorModeValue('black', 'white');
  const textColor = useColorModeValue(
    'rgba(0,0,0,70%)',
    'rgba(255,255,255,70%)'
  );
  const popOverBackground = useColorModeValue('#d3d3d3', '#34363c');

  const handleMouseOver = (e: HoverEvent) => {
    e.preventDefault();
    if (!beingHovered) {
      setBeingHovered(true);
    }
  };

  const handleMouseLeave = (e: HoverEvent) => {
    e.preventDefault();
    setBeingHovered(false);
  };

  const popOverHeight = '36px';

  return (
    <ListItem
      px={2}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      background={beingHovered ? 'rgba(4,4,5,0.07)' : undefined}
      color={textColor}
      position="relative"
      // pl="72px"
      pr="100px"
      py="0.075rem"
    >
      {isNotPreviousMessageOwner && (
        <Text color={usernameColor} mr={2}>
          {message.user.name}
        </Text>
      )}
      <Box>
        {!editingMode ? (
          <Text>{message.text}</Text>
        ) : (
          <Formik
            initialValues={{ text: message.text }}
            onSubmit={(values) => {
              console.log(values.text.trim());
              if (
                message._id &&
                values.text.trim() &&
                message.text !== values.text
              ) {
                editMessage({ ...message, text: values.text });
              }
              setEditingMode(false);
            }}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <FormikInput
                  autoFocus
                  w="100%"
                  name="text"
                  maxH="24px"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setEditingMode(false);
                  }}
                />
              </Form>
            )}
          </Formik>
        )}
      </Box>
      {!editingMode && beingHovered && (
        <Flex
          h={popOverHeight}
          backgroundColor={popOverBackground}
          position="absolute"
          top={`calc(-${popOverHeight} / 2)`}
          borderRadius="4px"
          right="24px"
          justify="center"
          align="center"
          boxShadow="0 2px 2px -1px rgba(0,0,0,0.9)"
          px={2}
        >
          {socket?.user?._id === message.user._id && (
            <>
              <IconButton
                mr={1}
                label="Modify.."
                onClick={() => setEditingMode(true)}
              >
                <MdEdit />
              </IconButton>
              <IconButton
                label="Delete.."
                onClick={() => {
                  if (message._id) deleteMessage(message);
                }}
              >
                <MdDelete />
              </IconButton>
            </>
          )}
          <IconButton
            label="Add reaction.."
            onClick={() => setEditingMode(true)}
          >
            <HiEmojiHappy />
          </IconButton>
        </Flex>
      )}
    </ListItem>
  );
};
