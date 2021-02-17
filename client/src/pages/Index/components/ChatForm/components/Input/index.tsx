import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  InputProps,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { FC } from 'react';
import { useTyping } from './useTyping';

interface Props extends InputProps {
  name: string;
  label?: string;
}

export const Input: FC<Props> = ({ name, label, ...input }) => {
  const [{ value, ...field }, { error }] = useField(name);
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
        {...input}
        {...field}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
