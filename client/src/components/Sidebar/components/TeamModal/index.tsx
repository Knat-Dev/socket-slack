import {
  Modal,
  ModalContent,
  ModalOverlay,
  UseDisclosureProps,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { CreateTeam } from '../../../../components/';
import { useUIContext } from '../../../../context';

export const TeamModal: FC<UseDisclosureProps> = ({ isOpen, onClose }) => {
  const [, , chatInputRef] = useUIContext();
  if (!onClose || typeof isOpen !== 'boolean') return null;
  return (
    <Modal
      finalFocusRef={chatInputRef}
      isCentered
      onClose={onClose}
      isOpen={isOpen}
    >
      <ModalOverlay />
      <ModalContent background="#232426">
        <CreateTeam onClose={onClose} />
      </ModalContent>
    </Modal>
  );
};
