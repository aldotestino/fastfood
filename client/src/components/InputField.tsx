import { FormControl, As, FormErrorMessage, FormLabel, Icon, Input, InputGroup, InputLeftElement, InputProps } from '@chakra-ui/react';
import { Field, FieldProps } from 'formik';
import React from 'react';

export interface InputFieldProps extends InputProps {
  label: string
  errorMessage?: string
  icon?: As
}

function InputField({ label, errorMessage, icon, ...rest }: InputFieldProps) {

  return (
    <Field name={rest.name}>
      {({ field }: FieldProps) =>
        <FormControl isInvalid={rest.isInvalid}>
          <FormLabel>{label}</FormLabel>
          <InputGroup>
            {icon &&
                <InputLeftElement >
                  <Icon as={icon} w="4" h="4" />
                </InputLeftElement>
            }
            <Input focusBorderColor="yellow.400" {...field} {...rest} />
          </InputGroup>
          {rest.isInvalid &&<FormErrorMessage>{errorMessage}</FormErrorMessage>}
        </FormControl>}
    </Field>
  );
}

export default InputField;
