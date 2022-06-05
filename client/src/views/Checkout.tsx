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
  Tr,
  VStack
} from '@chakra-ui/react';
import useCartStore from '../store/cartStore';
import shallow from 'zustand/shallow';
import CheckoutItem from '../components/CheckoutItem';

function Checkout() {

  const { items } = useCartStore(({ items }) => ({ items }), shallow);

  return (
    <TableContainer p={[5, 10]}>
      <Table variant="striped">
        {items.length === 0 && <TableCaption>Il carrllo è vuoto</TableCaption>}
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th isNumeric>Quantità</Th>
            <Th isNumeric>Prezzo</Th>
            <Th isNumeric>Totale</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item, i) => <CheckoutItem key={i} cartItem={item} />)}
        </Tbody>
        {items.length > 0 && <Tfoot>
          <Tr>
            <Td></Td>
            <Td></Td>
            <Td isNumeric fontWeight="bold">
              Importo totale
            </Td>
            <Td isNumeric fontWeight="bold">{items.reduce((s, c) => s + c.item.price * c.quantity, 0).toFixed(2)} €</Td>
          </Tr>
        </Tfoot>}
      </Table>
    </TableContainer>
  );
}

export default Checkout;
