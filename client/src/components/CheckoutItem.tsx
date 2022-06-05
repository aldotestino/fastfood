import { CartItem } from '../types';
import { Td, Tr } from '@chakra-ui/react';

interface CheckoutItemProps {
  cartItem: CartItem
}

function CheckoutItem({ cartItem }: CheckoutItemProps) {
  return (
    <Tr>
      <Td>{cartItem.item.name}</Td>
      <Td isNumeric>{cartItem.quantity}</Td>
      <Td isNumeric>{cartItem.item.price.toFixed(2)} €</Td>
      <Td isNumeric>{(cartItem.item.price*cartItem.quantity).toFixed(2)} €</Td>
    </Tr>
  );
}

export default CheckoutItem;
