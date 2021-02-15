import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputProps,
} from '@chakra-ui/react';
import { useField } from 'formik';
import React, { FC } from 'react';

interface Props extends InputProps {
  name: string;
  label?: string;
}

export const FormikInput: FC<Props> = ({ name, label, ...input }) => {
  const [field, { error }] = useField(name);

  return (
    <FormControl isInvalid={!!error}>
      {label && (
        <FormLabel mt={4} htmlFor={field.name}>
          {label}
        </FormLabel>
      )}
      <Input focusBorderColor="purple.500" {...input} {...field} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};
