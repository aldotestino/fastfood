import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Stack,
  useToast,
} from '@chakra-ui/react';
import Link from '../components/Link';
import { Field, Form, Formik } from 'formik';
import InputField from '../components/InputField';
import { AtSymbolIcon, KeyIcon } from '@heroicons/react/outline';
import React, { useState } from 'react';
import { LoginVariables, OnSubmitFunc, UserRole } from '../utils/types';
import { OptionBase, Select } from 'chakra-react-select';
import { LoginSchema } from '../utils/validators';
import { Navigate, useNavigate } from 'react-router-dom';
import useUserStore from '../store/userStore';

const initialValues: LoginVariables = {
  email: '',
  password: '',
  role: UserRole.CUSTOMER
};

interface RoleOptions extends OptionBase {
  label: string
  value: string
}

const roleOptions: Array<RoleOptions> = [
  {
    label: 'Cliente',
    value: UserRole.CUSTOMER,
  },
  {
    label: 'Cuoco',
    value: UserRole.COOK
  },
  {
    label: 'Amministratore',
    value: UserRole.ADMIN
  }
];

function Login() {

  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuth, user } = useUserStore();
  const navigate = useNavigate();
  const toast = useToast();

  const onSubmit: OnSubmitFunc<LoginVariables> = async (values, { resetForm }) => {
    setIsLoading(true);
    const res = await login(values);
    setIsLoading(false);
    resetForm();
    if(!res.success) {
      toast({
        title: 'Errore',
        description: res.data.errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
    }
  };

  return (
    <Flex py={[0, 10]} align="center" direction="column">
      {isAuth && user?.role === UserRole.CUSTOMER ? <Navigate to="/profile" /> : isAuth && user?.role == UserRole.COOK ? <Navigate to="/" /> : null}
      <Box border={['none', '1px']} w={['100%', 'md']} borderColor={['', 'gray.200']} rounded="lg" p={[5, 8]}>
        <Heading mb="6" fontStyle="italic">Login</Heading>
        <Formik
          initialValues={initialValues}
          validateOnBlur={false}
          validationSchema={LoginSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched, setFieldValue }) =>
            <Form>
              <Stack spacing="6">
                <InputField
                  name="email"
                  icon={AtSymbolIcon}
                  errorMessage={errors.email}
                  label="Email"
                  placeholder="mario@gmail.com"
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
                      <Select 
                        options={roleOptions} 
                        colorScheme="yellow" 
                        defaultValue={roleOptions[0]} 
                        onChange={ro => setFieldValue(field.name, ro?.value)} 
                        focusBorderColor="yellow.400"
                        selectedOptionStyle='check'
                        selectedOptionColor='yellow'
                      />
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
