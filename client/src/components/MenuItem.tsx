import { VStack, Image, Text, HStack, Button, Input, Icon, IconButton, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, AlertDialogContent, useToast, Box, Center, useColorModeValue } from '@chakra-ui/react';
import { PuzzleIcon, ShoppingBagIcon } from '@heroicons/react/outline';
import { RefObject, useState } from 'react';
import useCartStore from '../store/cartStore';
import shortid from 'shortid';
import { Item } from '../utils/types';
import Ingredients from './Ingredients';
import { API_URL, IMAGE_URL } from '../utils/vars';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import React from 'react';
import CreateOrUpdateItem from './CreateOrUpdateItem';

const MAX_QUANTITY = 10;

interface MenuItemProps {
  item: Item
  isAdmin: boolean,
  removeItemFromMenu: (item: Item) => void
  updateItem: (item: Item) => void
}

function MenuItem({ item, isAdmin, removeItemFromMenu, updateItem }: MenuItemProps) {

  const imageUrl = `${IMAGE_URL}/${item.imageUrl}`;

  const { isOpen: isOpenConfirm, onOpen: onOpenConfirm, onClose: onCloseConfirm } = useDisclosure();
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure();
  const cancelRef = React.useRef() as RefObject<HTMLButtonElement>;
  const bg = useColorModeValue('gray.100', 'gray.700');

  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItemToCart } = useCartStore();
  const toast = useToast();

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

  async function handleDeleteItem() {
    setIsLoading(false);
    const res = await fetch(`${API_URL}/menu`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ itemId: item.id }),
      credentials: 'include'
    }).then(r => r.json());
    setIsLoading(false);
    onCloseConfirm();
    if(res.success) {
      removeItemFromMenu(item);
    }else {
      toast({
        title: 'Errore',
        description: res.data.errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
    }
  }

  return (
    <VStack>
      {item.imageUrl ? <Image alt={item.name} h="xs" cursor="pointer" _hover={{ transform: 'scale(1.1)' }} style={{ filter: 'drop-shadow(5px 5px 5px #222)', transition: '.2s ease' }} src={imageUrl}/> : <VStack justify="center" bg={bg} borderRadius="3xl" h="xs" w="xs"><Text>Immagine non disponibile</Text><Icon as={PuzzleIcon} w="10" h="10" /></VStack>}
      <VStack>
        <HStack>
          {item.ingredients.length > 0 && <Ingredients ingredients={item.ingredients} />}
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
          <HStack>
            <Button leftIcon={<Icon as={EditIcon} />} onClick={onOpenEdit} colorScheme="yellow">Modifica</Button>
            <IconButton aria-label='delete item' onClick={onOpenConfirm} colorScheme="red" icon={<DeleteIcon />} />
          </HStack>
        }
      </VStack>

      <AlertDialog
        isOpen={isOpenConfirm}
        leastDestructiveRef={cancelRef}
        onClose={onCloseConfirm}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Rimuovi elemento
            </AlertDialogHeader>

            <AlertDialogBody>
              L&apos;elemento non sarà definitivamente eliminato per poter consultare gli ordini avvenuti prima dell&apos;eliminazione.
              Sei sicuro di voler proseguire?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} isDisabled={isLoading} onClick={onCloseConfirm}>
                Annulla
              </Button>
              <Button colorScheme='red' isLoading={isLoading} isDisabled={isLoading} onClick={handleDeleteItem} ml={3}>
                Elimina
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <CreateOrUpdateItem itemId={item.id} action="update" updateItem={updateItem} isOpen={isOpenEdit} onClose={onCloseEdit} initialValues={{
        name: item.name,
        imageUrl: item.imageUrl,
        ingredients: item.ingredients,
        price: item.price,
        type: item.type
      }} />
    </VStack>
  );
}

export default MenuItem;
