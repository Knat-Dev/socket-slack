import {
  Box,
  Button,
  Flex,
  Text,
  useColorMode,
  useMediaQuery,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { FC, useEffect, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { MdBrightnessHigh, MdBrightnessLow } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useAuthContext, useUIContext } from '../../context';
import { setAccessToken } from '../../utils';
import { MobileMenu } from '../MobileMenu';
import { IconButton } from './components';

interface Props {
  h: number;
}

export const Navbar: FC<Props> = ({ h }) => {
  const [, setAuthState] = useAuthContext();
  const [{ isDrawerOpen, isMobile }, uiDispatch, chatInputRef] = useUIContext();
  const [loading, setLoading] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const [showMobileMenu] = useMediaQuery('(max-width: 1000px)');

  useEffect(() => {
    if (showMobileMenu) uiDispatch({ type: 'set_mobile' });
    else uiDispatch({ type: 'set_desktop' });
  }, [showMobileMenu, uiDispatch]);

  return (
    <>
      <Flex
        h={h}
        background="#36393F"
        boxShadow="0 1px 0 rgba(4,4,5,0.2),0 1.5px 0 rgba(6,6,7,0.05),0 2px 0 rgba(4,4,5,0.05)"
        justify="space-between"
        align="center"
        px={2}
        color="white"
      >
        <Flex align="center">
          {isMobile && (
            <IconButton
              onClick={() => {
                uiDispatch({ type: 'set_drawer_open' });
                chatInputRef.current?.focus();
              }}
            >
              <AiOutlineMenu />
            </IconButton>
          )}
          <Box lineHeight={h}>
            <Text as={Link} to="/" fontSize="lg">
              CHAT APP
            </Text>
          </Box>
        </Flex>
        <Flex align="center">
          <IconButton onClick={toggleColorMode}>
            {colorMode === 'dark' ? (
              <MdBrightnessLow fontSize="18px" />
            ) : (
              <MdBrightnessHigh fontSize="18px" />
            )}
          </IconButton>
          <Button
            size="sm"
            disabled={loading}
            isLoading={loading}
            variant="outline"
            _hover={{ backgroundColor: 'white', color: '#2C2E31' }}
            boxShadow="0 0 5px 1px rgba(0,0,0,0.2)"
            borderColor={'rgba(255, 255, 255, 0.16)'}
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
      <MobileMenu
        isOpen={isDrawerOpen}
        onClose={() => {
          uiDispatch({ type: 'set_drawer_closed' });
        }}
      />
    </>
  );
};
