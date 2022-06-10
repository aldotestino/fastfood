import { HStack, Text, Icon, Tooltip } from '@chakra-ui/react';
import { ShoppingBagIcon } from '@heroicons/react/outline';
import { Link as RLink } from 'react-router-dom';
import useCartStore from '../store/cartStore';

function Cart() {

  const { total } = useCartStore();

  return (
    <Tooltip label="Vai al carrello">
      <HStack _hover={{ color: 'yellow.400' }} as={RLink} to="/checkout" >
        <Text>{total().toFixed(2)} €</Text>
        <Icon as={ShoppingBagIcon}/>
      </HStack>
    </Tooltip>
  );
}

export default Cart;
