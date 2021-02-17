import { Button, ButtonProps } from '@chakra-ui/react';
import React, { FC } from 'react';

export const IconButton: FC<ButtonProps> = (props) => {
  return (
    <Button
      mr={2}
      px="0"
      size="sm"
      borderRadius="50%"
      _focus={{ outline: 'none' }}
      onClick={props.onClick}
      background="transparent"
      boxShadow="0 0 5px 1px rgba(0,0,0,0.2)"
      border="1px solid"
      borderColor={'rgba(255, 255, 255, 0.16)'}
      _hover={{ backgroundColor: 'white', color: '#2C2E31' }}
      _active={{ backgroundColor: '#d4d4d4' }}
    >
      {props.children}
    </Button>
  );
};
