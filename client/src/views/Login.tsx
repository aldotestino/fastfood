import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Stack,
} from '@chakra-ui/react';
import Link from '../components/Link';
import { Field, Form, Formik } from 'formik';
import InputField from '../components/InputField';
import { AtSymbolIcon, KeyIcon } from '@heroicons/react/outline';
import React, { useState } from 'react';
import { FormikHelpers } from 'formik/dist/types';
import { LoginVariables, OnSubmitFunc, Role } from '../utils/types';
import { OptionBase, Select } from 'chakra-react-select';
import { LoginSchema } from '../utils/validators';

const initialValues: LoginVariables = {
  email: 'aldo.testino@libero.it',
  password: 'atxfour300101',
  role: Role.CLIENT
};

interface RoleOptions extends OptionBase {
  label: string
  value: string
}

const roleOptions: Array<RoleOptions> = [
  {
    label: 'Cliente',
    value: Role.CLIENT,
  },
  {
    label: 'Cuoco',
    value: Role.COOK
  },
  {
    label: 'Amministratore',
    value: Role.ADMIN
  }
];

function Login() {

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: OnSubmitFunc<LoginVariables> = (values, { resetForm }) => {
    setIsLoading(true);
    setTimeout(() => {
      console.log(values);
      setIsLoading(false);
      resetForm();
    }, 100);
  };

  return (
    <Flex py={[0, 10]} align="center" direction="column">
      <Box border={['none', '1px']} w={['100%', 'md']} borderColor={['', 'gray.200']} rounded="lg" p={[5, 8]}>
        <Heading mb="6" fontStyle="italic">Login</Heading>
        <Formik
          initialValues={initialValues}
          validateOnBlur={false}
          validationSchema={LoginSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched, setFieldValue, values }) =>
            <Form>
              <Stack spacing="6">
                <InputField
                  name="email"
                  icon={AtSymbolIcon}
                  errorMessage={errors.email}
                  label="Email"
                  placeholder="selena@gmail.com"
                  type="text"
                  isInvalid={Boolean(errors.email && touched.email)}
                  isDisabled={isLoading}
                />
                <InputField
                  name="password"
                  icon={KeyIcon}
                  errorMessage={errors.password}
                  label="Password"
                  placeholder="*****"
                  type="password"
                  isInvalid={Boolean(errors.password && touched.password)}
                  isDisabled={isLoading}
                />
                <Field name="role">
                  {({ field }: {field: any}) =>
                    <FormControl>
                      <FormLabel>Ruolo</FormLabel>
                      <Select options={roleOptions} defaultValue={roleOptions[0]} onChange={ro => setFieldValue(field.name, ro?.value)} focusBorderColor="yellow.400" />
                    </FormControl>}
                </Field>
                <Button type="submit" colorScheme="yellow" isLoading={isLoading}>Login</Button>
                <Link textAlign="center" to="/signup">Non hai un&apos;account?</Link>
              </Stack>
            </Form>}
        </Formik>
      </Box>
    </Flex>
  );
}

export default Login;
