import { Button, ButtonProps, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';

interface Props extends ButtonProps {
  label?: string;
}

export const IconButton: FC<Props> = ({ children, label, ...button }) => {
  return (
    <Tooltip
      label={label}
      placement="top"
      backgroundColor="blackAlpha.400"
      color="white"
    >
      <Button
        p={0}
        h="26px"
        minW="26px"
        w="26px"
        borderRadius="50%"
        backgroundColor={button.background ?? 'transparent'}
        color="white"
        mr={button.mr}
        onClick={button.onClick}
        _hover={{ backgroundColor: 'purple.600' }}
        _active={{ backgroundColor: 'purple.700' }}
      >
        {children}
      </Button>
    </Tooltip>
  );
};
