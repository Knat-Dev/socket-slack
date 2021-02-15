import { Box, Button, Flex, Text, useColorMode } from '@chakra-ui/react';
import axios from 'axios';
import React, { FC, useState } from 'react';
import { MdBrightnessHigh, MdBrightnessLow } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context';
import { setAccessToken } from '../../utils';

interface Props {
  h: number;
}

export const Navbar: FC<Props> = ({ h }) => {
  const [, setAuthState] = useAuthContext();
  const [loading, setLoading] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      h={h}
      background="#2c2e31"
      justify="space-between"
      align="center"
      px={2}
      color="white"
    >
      <Box lineHeight={h}>
        <Text as={Link} to="/" fontSize="lg">
          CHAT APP
        </Text>
      </Box>

      <Flex align="center">
        <Button
          mr={2}
          px="0"
          size="sm"
          borderRadius="50%"
          _focus={{ outline: 'none' }}
          onClick={toggleColorMode}
          background="transparent"
          boxShadow="0 0 5px 1px rgba(0,0,0,0.2)"
          border="1px solid"
          borderColor={
            colorMode === 'light' ? '#E2E8F0' : 'rgba(255, 255, 255, 0.16)'
          }
          _hover={{ backgroundColor: 'white', color: 'purple.500' }}
        >
          {colorMode === 'dark' ? (
            <MdBrightnessLow fontSize="18px" />
          ) : (
            <MdBrightnessHigh fontSize="18px" />
          )}
        </Button>
        <Button
          size="sm"
          disabled={loading}
          isLoading={loading}
          variant="outline"
          _hover={{ backgroundColor: 'white', color: 'purple.500' }}
          boxShadow="0 0 5px 1px rgba(0,0,0,0.2)"
          onClick={async () => {
            try {
              setLoading(true);
              const res = await axios.post(
                `${process.env.REACT_APP_API}/users/logout`,
                undefined,
                { withCredentials: true }
              );
              if (res.data.ok) {
                setAccessToken(res.data.accessToken);
                setAuthState({ loggedIn: false });
              }
            } catch (e) {
              console.log(e);
            }
          }}
        >
          LOGOUT
        </Button>
      </Flex>
    </Flex>
  );
};
