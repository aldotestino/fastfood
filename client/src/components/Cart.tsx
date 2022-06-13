import { HStack, Text, Icon, Tooltip, StackProps } from '@chakra-ui/react';
import { ShoppingBagIcon } from '@heroicons/react/outline';
import { Link as RLink } from 'react-router-dom';
import useCartStore from '../store/cartStore';

function Cart(props: StackProps) {

  const { total } = useCartStore();

  return (
    <Tooltip label="Vai al carrello">
      <HStack _hover={{ color: 'yellow.400' }} {...props} as={RLink} to="/checkout" >
        <Text>{total().toFixed(2)} €</Text>
        <Icon as={ShoppingBagIcon}/>
      </HStack>
    </Tooltip>
  );
}

export default Cart;
