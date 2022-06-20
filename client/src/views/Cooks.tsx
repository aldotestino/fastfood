import { Table, TableCaption, TableContainer, Tbody, Th, Thead, Tr, Heading, Flex, Td, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, VStack, InputRightAddon, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { API_URL } from '../utils/vars';
import LoadingPage from '../components/LoadingPage';
import { Form, Formik } from 'formik';
import InputField from '../components/InputField';
import { CookSignupSchema } from '../utils/validators';
import { KeyIcon } from '@heroicons/react/outline';
import { CookSignupVariables, LoginVariables, OnSubmitFunc } from '../utils/types';

const initialValues: CookSignupVariables = {
  email: '',
  password: '',
};

function Cooks() {

  const [cooks, setCooks] = useState<Array<{email: string, orders: number}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_URL}/cook`, {
      credentials: 'include'
    }).then(r => r.json()).then(res => {
      if(res.success) {
        setCooks(res.data.cooks);
        setIsLoading(false);
      }
    });
  }, []);

  const onSubmit: OnSubmitFunc<LoginVariables> = async (values, { resetForm }) => {
    setIsSubmitting(true);
    const res = await fetch(`${API_URL}/cook/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: `${values.email}@vcetmang.online`, password: values.password }),
      credentials: 'include'
    }).then(r => r.json());
    setIsSubmitting(false);
    resetForm();
    onClose();
    if(res.success) {
      const newCook = {
        email: res.data.user.email,
        orders: 0
      };
      setCooks(ps => [newCook, ...ps]);
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
    <>
      {!isLoading ?
        <TableContainer px={[0, 5, 10, 20]} py={[5, 10]}>
          <Flex justify="space-between">
            <Heading ml={[5, 0]} mb="6" fontStyle="italic">Cuochi</Heading>
            <Button mr={[5, 0]} onClick={onOpen} colorScheme="yellow">Aggiungi cuoco</Button>
          </Flex>
          <Table variant="striped">
            {cooks.length === 0 && <TableCaption>Non ci sono cuochi</TableCaption>}
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th isNumeric>Ordini</Th>
              </Tr>
            </Thead>
            <Tbody>
              {cooks.map(c => <Tr key={c.email}><Td>{c.email}</Td><Td isNumeric>{c.orders}</Td></Tr>)}
            </Tbody>
          </Table>
        </TableContainer> :
        <LoadingPage/>
      }

      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Aggiungi cuoco</ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={initialValues}
            validateOnBlur={false}
            validationSchema={CookSignupSchema}
            onSubmit={onSubmit}
          >
            {({ errors, touched }) =>
              <Form>
                <ModalBody pb={6}>
                  <VStack spacing="6">
                    <InputField
                      name="email"
                      errorMessage={errors.email}
                      label="Email"
                      placeholder="mario"
                      type="text"
                      isInvalid={Boolean(errors.email && touched.email)}
                      isDisabled={isLoading}
                    >
                      <InputRightAddon>@vcetmang.online</InputRightAddon>
                    </InputField>
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
                  </VStack>
                </ModalBody>

                <ModalFooter>
                  <Button onClick={onClose} mr={3} isDisabled={isSubmitting}>Annulla</Button>
                  <Button colorScheme='yellow' type="submit" isLoading={isSubmitting} isDisabled={isSubmitting}>
                    Salva
                  </Button>
                </ModalFooter>
              </Form>
            }
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Cooks;
