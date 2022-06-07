import { VStack, Image, Text, HStack, Button, Input, Icon, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, IconButton, UnorderedList, ListItem } from '@chakra-ui/react';
import { ShoppingBagIcon, InformationCircleIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import useCartStore from '../store/cartStore';
import shallow from 'zustand/shallow';
import shortid from 'shortid';
import { Item, ItemType } from '../utils/types';
import Ingredients from './Ingredients';

const MAX_QUANTITY = 10;

function MenuItem(item: Item) {

  const [quantity, setQuantity] = useState(1);
  const { addItemToCart } = useCartStore(({ addItemToCart }) => ({ addItemToCart }), shallow);

  function increment() {
    if(quantity < MAX_QUANTITY) {
      setQuantity(quantity+1);
    }
  }

  function decrement() {
    if(quantity > 1) {
      setQuantity(quantity-1);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = parseInt(e.currentTarget.value);
    if(q > 10) {
      setQuantity(10);
    }else if(q < 1) {
      setQuantity(1);
    }else {
      setQuantity(q);
    }
  }

  function handleAddItemToCart() {
    addItemToCart({
      id: shortid(),
      item, 
      quantity: isNaN(quantity) ? 1 : quantity
    });
  }

  return (
    <VStack>
      <Image h="xs" cursor="pointer" _hover={{ transform: 'scale(1.1)' }} style={{ filter: 'drop-shadow(5px 5px 5px #222)', transition: '.2s ease' }} src={item.imageUrl}/>
      <VStack>
        <HStack>
          {item.type !== ItemType.DRINK && <Ingredients ingredients={item.ingredients} />}
          <Text fontSize="xl">{item.name} - {item.price.toFixed(2)} €</Text>
        </HStack>
        <HStack maxW="150px">
          <Button onClick={decrement}>-</Button>
          <Input value={quantity} type="number" min={1} max={10} onChange={onInputChange} />
          <Button onClick={increment}>+</Button>
        </HStack>
        <Button leftIcon={<Icon as={ShoppingBagIcon} />} onClick={handleAddItemToCart} colorScheme="yellow">Aggiungi al carrello</Button>
      </VStack>
    </VStack>
  );
}

export default MenuItem;
