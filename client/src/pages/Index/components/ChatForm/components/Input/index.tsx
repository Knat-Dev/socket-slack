import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  InputProps,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { FC } from 'react';
import { useUIContext } from '../../../../../../context';
import { useTyping } from './useTyping';

interface Props extends InputProps {
  name: string;
  label?: string;
}

export const Input: FC<Props> = ({ name, label, ...input }) => {
  const [{ value, ...field }, { error }] = useField(name);
  const [, , chatInputRef] = useUIContext();
  useTyping(value);

  return (
    <FormControl isInvalid={!!error}>
      {label && (
        <FormLabel mt={4} htmlFor={field.name}>
          {label}
        </FormLabel>
      )}
      <ChakraInput
        focusBorderColor="purple.500"
        value={value}
        ref={(ref) => {
          if (!chatInputRef.current && ref) chatInputRef.current = ref;
        }}
        {...input}
        {...field}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
