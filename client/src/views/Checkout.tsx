import {
  Button,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr, useMediaQuery,
  Heading,
  Text,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  useToast,
  Flex
} from '@chakra-ui/react';
import Link from '../components/Link';
import useCartStore from '../store/cartStore';
import CheckoutItem from '../components/CheckoutItem';
import { RefObject, useRef, useState } from 'react';
import { Link as RLink } from 'react-router-dom';
import useUserStore from '../store/userStore';
import { API_URL } from '../utils/vars';

function Checkout() {

  const { items, clearCart, total } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const [isDesktop] = useMediaQuery('(min-width: 48em)');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef() as RefObject<HTMLButtonElement>;
  const { isAuth } = useUserStore();
  const toast = useToast();

  async function handleCheckout() {
    setIsLoading(true);

    const res = await fetch(`${API_URL}/customer/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(items.map(i => ({ itemId: i.item.id, quantity: i.quantity }))),
      credentials: 'include'
    }).then(r => r.json());

    setIsLoading(false);
    onClose();
    if(res.success) {
      clearCart();
      toast({
        title: 'Ordine creato',
        description: <Text>Visualizza lo stato dell&apos;ordine nel <Link noColor to='/profile'>tuo profilo</Link></Text>,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
    }
  }

  return (
    <>
      <TableContainer px={[0, 5, 10, 20]} py={[5, 10]}>
        <Flex justify="space-between">
          <Heading ml={[5, 0]} mb="6" fontStyle="italic">Checkout</Heading>
          {items.length > 0 && <Button onClick={clearCart} colorScheme="red">Svuota carrello</Button>}
        </Flex>
        <Table variant="striped">
          {items.length === 0 && <TableCaption>Il carrello è vuoto</TableCaption>}
          <Thead>
            <Tr>
              <Th>Nome</Th>
              {isDesktop && <>
                <Th isNumeric>Quantità</Th>
                <Th isNumeric>Prezzo</Th>
              </>}
              <Th isNumeric>Totale</Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map(item => <CheckoutItem key={item.id} cartItem={item} isDesktop={isDesktop} />)}
          </Tbody>
          {items.length > 0 && <Tfoot>
            <Tr>
              {isDesktop && <><Td></Td><Td></Td></>}
              <Td isNumeric={isDesktop} fontWeight="bold">
                Importo totale
              </Td>
              <Td isNumeric fontWeight="bold">{total().toFixed(2)} €</Td>
            </Tr>
            <Tr>
              {isDesktop && <><Td borderBottom="none"></Td><Td borderBottom="none"></Td></>}
              <Td borderBottom="none"></Td>
              <Td isNumeric borderBottom="none">
                <Button onClick={onOpen} colorScheme="yellow">Checkout</Button>
              </Td>
            </Tr>
          </Tfoot>}
        </Table>
        
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
          closeOnOverlayClick={!isLoading}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Checkout
              </AlertDialogHeader>

              <AlertDialogBody>
                {isAuth ? 'Sei sicuro di voler procedere con l\'acquisto dei prodotti?' : 'Prima di procedere con l\'acquisto è necessario effettuare il login.'}
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button disabled={isLoading} ref={cancelRef} onClick={onClose}>
                  Annulla
                </Button>
                {isAuth ? 
                  <Button colorScheme='yellow' isLoading={isLoading} onClick={handleCheckout} ml={3}>
                    Continua
                  </Button> : 
                  <Button colorScheme='yellow' as={RLink} to="/login"  ml={3}>
                    Login
                  </Button>}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

      </TableContainer>
    </>
  );
}

export default Checkout;
