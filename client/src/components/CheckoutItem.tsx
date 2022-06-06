import { CartItem } from '../types';
import { IconButton, Td, Tr } from '@chakra-ui/react';
import { MinusIcon } from '@chakra-ui/icons';
import useCartStore from '../store/cartStore';
import shallow from 'zustand/shallow';

interface CheckoutItemProps {
  cartItem: CartItem,
  isDesktop: boolean
}

function CheckoutItem({ cartItem, isDesktop }: CheckoutItemProps) {

  const { deleteItemFromCart } = useCartStore(({ deleteItemFromCart }) => ({ deleteItemFromCart }), shallow);

  return (
    <Tr>
      <Td>
        <IconButton aria-label="delete item" mr={2} icon={<MinusIcon />} color="red.400" variant="ghost" onClick={() => deleteItemFromCart(cartItem.id)}/>
        {!isDesktop && `${cartItem.quantity} x `}{cartItem.item.name}
      </Td>
      {isDesktop && <>
        <Td isNumeric>{cartItem.quantity}</Td>
        <Td isNumeric>{cartItem.item.price.toFixed(2)} €</Td>
      </>}
      <Td isNumeric>{(cartItem.item.price*cartItem.quantity).toFixed(2)} €</Td>
    </Tr>
  );
}

export default CheckoutItem;
