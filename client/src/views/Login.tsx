import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Stack,
  useToast,
} from '@chakra-ui/react';
import Link from '../components/Link';
import { Form, Formik } from 'formik';
import InputField from '../components/InputField';
import { AtSymbolIcon, KeyIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import { LoginVariables, OnSubmitFunc, UserRole } from '../utils/types';
import { OptionBase, Select } from 'chakra-react-select';
import { LoginSchema } from '../utils/validators';
import { Navigate } from 'react-router-dom';
import useUserStore from '../store/userStore';

const initialValues: LoginVariables = {
  email: '',
  password: '',
};

const roleOptions = [
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
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [remember, setRemember] = useState(false);
  const toast = useToast();

  const onSubmit: OnSubmitFunc<LoginVariables> = async (values, { resetForm }) => {
    setIsLoading(true);
    const res = await login({
      ...values,
      role,
      remember
    });
    setIsLoading(false);
    resetForm();
    setRemember(false);
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
      {isAuth && user?.role === UserRole.CUSTOMER ? <Navigate to="/profile" /> : isAuth && (user?.role == UserRole.COOK || user?.role == UserRole.ADMIN) ? <Navigate to="/" /> : null}
      <Box border={['none', '1px']} w={['100%', 'md']} borderColor={['', 'inherit']} rounded="lg" p={[5, 8]}>
        <Heading mb="6" fontStyle="italic">Login</Heading>
        <Formik
          initialValues={initialValues}
          validateOnBlur={false}
          validationSchema={LoginSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched }) =>
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
                <FormControl>
                  <FormLabel>Ruolo</FormLabel>
                  <Select
                    options={roleOptions}
                    name="role"
                    defaultValue={roleOptions[0]}
                    value={roleOptions.find(o => o.value === role)}
                    onChange={ro => setRole(ro?.value as UserRole)}
                    focusBorderColor="yellow.400"
                    selectedOptionStyle='check'
                    isDisabled={isLoading}
                  />
                </FormControl>
                <Checkbox isChecked={remember} onChange={e => setRemember(e.target.checked)} colorScheme="yellow" isDisabled={isLoading}>Ricordami</Checkbox>
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
