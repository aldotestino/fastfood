import { Box, Button, Flex, Heading, Stack } from '@chakra-ui/react';
import Link from '../components/Link';
import { Formik, Form } from 'formik';
import InputField from '../components/InputField';
import { AtSymbolIcon, KeyIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import { SignupVariables, OnSubmitFunc, LoginVariables } from '../utils/types';
import { SignupSchema } from '../utils/validators';
import { FormikHelpers } from 'formik/dist/types';

const initialValues: SignupVariables = {
  firstName: '',
  lastName: '',
  email: '',
  password: ''
};

function Signup() {

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: OnSubmitFunc<SignupVariables> = (values, { resetForm }) => {
    setIsLoading(true);
    setTimeout(() => {
      console.log(values);
      setIsLoading(false);
      resetForm();
    }, 5000);
  };

  return (
    <Flex py={[0, 10]} align="center" direction="column">
      <Box border={['none', '1px']} w={['100%', 'md']} borderColor={['', 'gray.200']} rounded="lg" p={[5, 8]}>
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
                  placeholder="Selena"
                  type="text"
                  isInvalid={Boolean(errors.firstName && touched.firstName)}
                  isDisabled={isLoading}
                />
                <InputField
                  name="lastName"
                  errorMessage={errors.lastName}
                  label="Last name"
                  placeholder="Hamilton"
                  type="text"
                  isInvalid={Boolean(errors.lastName && touched.lastName)}
                  isDisabled={isLoading}
                />
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
