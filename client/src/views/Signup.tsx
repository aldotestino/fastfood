import { Box, Button, Flex, Heading, Stack, useToast } from '@chakra-ui/react';
import Link from '../components/Link';
import { Formik, Form } from 'formik';
import InputField from '../components/InputField';
import { AtSymbolIcon, KeyIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import { SignupVariables, OnSubmitFunc, UserRole } from '../utils/types';
import { SignupSchema } from '../utils/validators';
import { API_URL } from '../utils/vars';
import { Navigate, useNavigate } from 'react-router-dom';
import useUserStore from '../store/userStore';

const initialValues: SignupVariables = {
  firstName: '',
  lastName: '',
  email: '',
  password: ''
};

function Signup() {

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuth, user } = useUserStore();

  const onSubmit: OnSubmitFunc<SignupVariables> = async (values, { resetForm }) => {
    setIsLoading(true);
    const res = await fetch(`${API_URL}/customer/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values)
    }).then(r => r.json());
    resetForm();
    setIsLoading(false);
    if(res.success) {
      navigate('/login');
    }else {
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
      <Box border={['none', '1px']} w={['100%', 'md']} borderColor={['', 'inherit']} rounded="lg" p={[5, 8]}>
        <Heading mb="6" fontStyle="italic">Signup</Heading>
        <Formik
          initialValues={initialValues}
          validateOnBlur={false}
          validationSchema={SignupSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched }) =>
            <Form>
              <Stack spacing="6">
                <InputField
                  name="firstName"
                  errorMessage={errors.firstName}
                  label="First name"
                  placeholder="Mario"
                  type="text"
                  isInvalid={Boolean(errors.firstName && touched.firstName)}
                  isDisabled={isLoading}
                />
                <InputField
                  name="lastName"
                  errorMessage={errors.lastName}
                  label="Last name"
                  placeholder="Rossi"
                  type="text"
                  isInvalid={Boolean(errors.lastName && touched.lastName)}
                  isDisabled={isLoading}
                />
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
                <Button type="submit" colorScheme="yellow" isLoading={isLoading}>Signup</Button>
                <Link textAlign="center" to="/login">Hai già un&apos;account?</Link>
              </Stack>
            </Form>}
        </Formik>
      </Box>
    </Flex>
  );
}

export default Signup;
