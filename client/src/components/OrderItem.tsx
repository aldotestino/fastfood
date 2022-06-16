import { HStack, Image, Text } from '@chakra-ui/react';
import { Item, ItemType } from '../utils/types';
import { IMAGE_URL } from '../utils/vars';
import Ingredients from './Ingredients';

interface OrderItemProps {
  item: Item
  quantity: number,
  isDesktop: boolean
}

function OrderItem({ item, quantity, isDesktop }: OrderItemProps) {

  const imageUrl = `${IMAGE_URL}/${item.imageUrl}`;

  return (
    <HStack w="100%" justify="space-between">
      <HStack>
        {isDesktop && <Image h="100px" src={imageUrl} />}
        <Text fontSize="lg">{quantity} x {item.name}</Text>
        {item.type !== ItemType.DRINK && <Ingredients ingredients={item.ingredients} />}
      </HStack>
      <Text fontSize="lg" fontWeight="bold">{item.price.toFixed(2)} €</Text>
    </HStack>
  );
}

export default OrderItem;