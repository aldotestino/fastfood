import { HStack, Text, Icon, Tooltip } from '@chakra-ui/react';
import { ShoppingBagIcon } from '@heroicons/react/outline';
import { Link as RLink } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import shallow from 'zustand/shallow';

function Cart() {

  const { items } = useCartStore(({ items }) => ({ items }), shallow);

  return (
    <Tooltip label="Vai al carrello">
      <HStack _hover={{ color: 'yellow.400' }} as={RLink} to="/cart" >
        <Text>{items.reduce((sum, c) => sum += c.item.price * c.quantity, 0).toFixed(2)} €</Text>
        <Icon as={ShoppingBagIcon}/>
      </HStack>
    </Tooltip>
  );
}

export default Cart;
