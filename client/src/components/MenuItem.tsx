import { VStack, Image, Text, HStack, Button, Input, Icon } from '@chakra-ui/react';
import { ShoppingBagIcon } from '@heroicons/react/outline';
import { useState } from 'react';
import useCartStore from '../store/cartStore';
import shortid from 'shortid';
import { Item, ItemType } from '../utils/types';
import Ingredients from './Ingredients';
import { IMAGE_URL } from '../utils/vars';
import { EditIcon } from '@chakra-ui/icons';

const MAX_QUANTITY = 10;

interface MenuItemProps {
  item: Item
  isAdmin: boolean
}

function MenuItem({ item, isAdmin }: MenuItemProps) {

  const imageUrl = `${IMAGE_URL}/${item.imageUrl}`;

  const [quantity, setQuantity] = useState(1);
  const { addItemToCart } = useCartStore();

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

  function handleChangeItem() {
    console.log(`modifica elmento ${item.id}`);
  }

  return (
    <VStack>
      <Image alt={item.name} h="xs" cursor="pointer" _hover={{ transform: 'scale(1.1)' }} style={{ filter: 'drop-shadow(5px 5px 5px #222)', transition: '.2s ease' }} src={imageUrl}/>
      <VStack>
        <HStack>
          {item.type !== ItemType.DRINK && <Ingredients ingredients={item.ingredients} />}
          <Text fontSize="xl">{item.name} - {item.price.toFixed(2)} €</Text>
        </HStack>
        {!isAdmin && <HStack maxW="150px">
          <Button onClick={decrement}>-</Button>
          <label htmlFor="quantity" hidden></label>
          <Input value={quantity} name="quantity" type="number" min={1} max={10} onChange={onInputChange} />
          <Button onClick={increment}>+</Button>
        </HStack>}
        {!isAdmin ? 
          <Button leftIcon={<Icon as={ShoppingBagIcon} />} onClick={handleAddItemToCart} colorScheme="yellow">Aggiungi al carrello</Button> :
          <Button leftIcon={<Icon as={EditIcon} />} onClick={handleChangeItem} colorScheme="yellow">Modifica</Button> 
        }
      </VStack>
    </VStack>
  );
}

export default MenuItem;
