import { Button, ButtonProps, Tooltip } from '@chakra-ui/react';
import React, { FC } from 'react';

interface Props {
  label: string;
  borderRadiusPlacement?: 'left' | 'right';
}

export const PopoverIconButton: FC<ButtonProps & Props> = (button) => {
  return (
    <Tooltip label={button.label} placement="top">
      <Button
        bg={undefined}
        p={0}
        minW={button.minW}
        w={button.w}
        h={button.h}
        borderRadius={2}
        borderRightRadius={button.borderRadiusPlacement === 'right' ? 2 : 0}
        borderLeftRadius={button.borderRadiusPlacement === 'left' ? 2 : 0}
        color="whiteAlpha.700"
        transition="none"
        _hover={{ backgroundColor: 'rgba(255,255,255,0.03)', color: 'white' }}
        onClick={button.onClick}
      >
        {button.children}
      </Button>
    </Tooltip>
  );
};
