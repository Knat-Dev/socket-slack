import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  useColorMode,
  UseDisclosureProps,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { Sidebar } from '../Sidebar';

export const MobileMenu: FC<UseDisclosureProps> = ({ isOpen, onClose }) => {
  const { colorMode } = useColorMode();

  if (typeof isOpen !== 'boolean' || !onClose) return null;
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent
          maxW={320}
          backgroundColor={colorMode === 'dark' ? '#2C2E31' : 'blue.700'}
          color="white"
        >
          <DrawerBody p={0}>
            <Sidebar />
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};
