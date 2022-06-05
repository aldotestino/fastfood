import { VStack, Image, Text, HStack, useNumberInput, Button, Input, Icon } from '@chakra-ui/react';
import { ShoppingBagIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import useCartStore from '../store/cartStore';
import shallow from 'zustand/shallow';

interface MenuItemProps {
  image: string
  name: string
  price: number
}

const MAX_QUANTITY = 10;

function MenuItem({ image, name, price }: MenuItemProps) {

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
      item: {
        image,
        name,
        price
      },
      quantity
    });
  }

  return (
    <VStack>
      <Image h="xs" cursor="pointer" _hover={{ transform: 'scale(1.2)' }} style={{ filter: 'drop-shadow(5px 5px 5px #222)', transition: '.2s ease' }} src={image}/>
      <VStack>
        <Text fontSize="xl">{name} - {price.toFixed(2)} €</Text>
        <HStack maxW="150px">
          <Button onClick={decrement}>-</Button>
          <Input value={quantity} type="number" onChange={onInputChange} />
          <Button onClick={increment}>+</Button>
        </HStack>
        <Button leftIcon={<Icon as={ShoppingBagIcon} />} onClick={handleAddItemToCart} colorScheme="yellow">Aggiungi al carrello</Button>
      </VStack>
    </VStack>
  );
}

export default MenuItem;
