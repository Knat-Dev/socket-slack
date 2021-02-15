import { Flex, Spinner } from '@chakra-ui/react';
import React from 'react';

export const LoadingScreen = () => {
  return (
    <Flex h="100vh" justify="center" align="center">
      <Spinner size="xl" color="purple.500" />
    </Flex>
  );
};
