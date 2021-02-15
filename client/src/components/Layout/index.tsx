import { Flex } from '@chakra-ui/react';
import React, { FC } from 'react';
import { Navbar } from '..';
export const NAV_HEIGHT = 10;

interface Props {
  middle?: boolean;
}

export const Layout: FC<Props> = ({ children, middle }) => {
  const centered = middle ? 'center' : undefined;
  return (
    <Flex h="100vh" direction="column">
      <Navbar h={NAV_HEIGHT} />
      <Flex h="100%" justify={centered} align={centered} overflowY="auto">
        {children}
      </Flex>
    </Flex>
  );
};
