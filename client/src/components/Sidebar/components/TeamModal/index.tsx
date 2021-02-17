import {
  Modal,
  ModalContent,
  ModalOverlay,
  UseDisclosureProps,
} from '@chakra-ui/react';
import React, { FC } from 'react';
import { CreateTeam } from '../../../../components/';

export const TeamModal: FC<UseDisclosureProps> = ({ isOpen, onClose }) => {
  if (!onClose || typeof isOpen !== 'boolean') return null;
  return (
    <Modal isCentered onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent background="#232426">
        <CreateTeam onClose={onClose} />
      </ModalContent>
    </Modal>
  );
};
