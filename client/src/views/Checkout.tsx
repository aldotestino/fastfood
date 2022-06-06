import {
  Box,
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
  Heading
} from '@chakra-ui/react';
import useCartStore from '../store/cartStore';
import shallow from 'zustand/shallow';
import CheckoutItem from '../components/CheckoutItem';

function Checkout() {

  const { items, total } = useCartStore(({ items, total }) => ({ items, total }), shallow);

  const [isDesktop] = useMediaQuery('(min-width: 48em)');

  return (
    <TableContainer px={[0, 5, 10, 20]} py={[5, 10]}>
      <Heading ml={[5, 0]} mb="6" fontStyle="italic">Checkout</Heading>
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
        </Tfoot>}
      </Table>
    </TableContainer>
  );
}

export default Checkout;
