import { Box, Flex, ListItem, Text, useColorModeValue } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import React, { FC, MouseEvent, useState } from 'react';
import { HiEmojiHappy } from 'react-icons/hi';
import { MdDelete, MdEdit } from 'react-icons/md';
import { FormikInput } from '../../../../../../components';
import { useSocketContext } from '../../../../../../context';
import { Message } from '../../../../../../types';
import { PopoverIconButton } from './components';

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
  const popOverBackground = useColorModeValue('#d3d3d3', '#36393F');

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

  const popOverHeight = '32px';

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
        <Box
          position="absolute"
          top={`calc(-${popOverHeight} / 2)`}
          right="24px"
        >
          <Flex
            h={popOverHeight}
            backgroundColor={popOverBackground}
            borderRadius="3px"
            justify="center"
            align="center"
            boxShadow="0px 0px 0px 0.5px #292929"
            position="relative"
            _hover={{
              _before: {
                opacity: 1,
              },
            }}
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              borderRadius: 2,
              boxShadow: '0 4px 4px -2px rgba(0,0,0,0.4)',
              opacity: 0,
              transition: 'opacity 0.1s ease',
            }}
          >
            {socket?.user?._id === message.user._id && (
              <>
                <PopoverIconButton
                  minW={popOverHeight}
                  w={popOverHeight}
                  h={popOverHeight}
                  label="EDIT"
                  borderRadiusPlacement="left"
                  onClick={() => setEditingMode(true)}
                >
                  <MdEdit />
                </PopoverIconButton>
                <PopoverIconButton
                  minW={popOverHeight}
                  w={popOverHeight}
                  h={popOverHeight}
                  label="DELETE"
                  onClick={() => {
                    if (message._id) deleteMessage(message);
                  }}
                >
                  <MdDelete />
                </PopoverIconButton>
                <PopoverIconButton
                  minW={popOverHeight}
                  w={popOverHeight}
                  h={popOverHeight}
                  label="REACTIONS"
                  borderRadiusPlacement="right"
                  onClick={() => setEditingMode(true)}
                >
                  <HiEmojiHappy />
                </PopoverIconButton>
              </>
            )}
          </Flex>
        </Box>
      )}
    </ListItem>
  );
};
