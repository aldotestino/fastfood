import { Item, ItemType, UserRole } from '../utils/types';
import { Box, Heading, GridItem, SimpleGrid, VStack, Button, Flex, useDisclosure } from '@chakra-ui/react';
import MenuItem from '../components/MenuItem';
import { useEffect, useMemo, useState } from 'react';
import { API_URL } from '../utils/vars';
import LoadingPage from '../components/LoadingPage';
import useUserStore from '../store/userStore';
import AddItem, { ItemInitialValues } from '../components/CreateOrUpdateItem';

const createItemInitialValues: ItemInitialValues = {
  name: '',
  price: 0,
  imageUrl: '',
  ingredients: [],
  type: ItemType.APETIZER
};

interface ItemsByType {
  [ItemType.APETIZER]: Item[]
  [ItemType.CLUB_SANDWICH]: Item[]
  [ItemType.WRAP]: Item[]
  [ItemType.BURGER]: Item[]
  [ItemType.DESSERT]: Item[]
  [ItemType.DRINK]: Item[]
}

function Menu() {

  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Array<Item>>([]);

  const itemsByType = useMemo(() => {
    const r: ItemsByType = {
      [ItemType.APETIZER]: [],
      [ItemType.CLUB_SANDWICH]: [],
      [ItemType.WRAP]: [],
      [ItemType.BURGER]: [],
      [ItemType.DESSERT]: [],
      [ItemType.DRINK]: []
    };

    items.forEach(i => {
      r[i.type].push(i);
    });

    return r;
  }, [items]);

  function addItemToMenu(newItem: Item) {
    setItems(ps => [...ps, newItem]);
  }

  function removeItemFromMenu(item: Item) {
    setItems(ps => ps.filter(i => i.id !== item.id));
  }

  function updateItem(item: Item) {
    const newItems = items.map(i => {
      if(i.id === item.id) {
        i.name = item.name;
        i.imageUrl = item.imageUrl;
        i.ingredients = item.ingredients;
        i.type = item.type;
        i.price = item.price;
      }
      return i;
    });

    setItems(newItems);
  }

  const { user, isAuth } = useUserStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetch(`${API_URL}/menu`).then(raw => raw.json()).then((res) => {
      if(res.success) {
        setItems(res.data.menu);
        setIsLoading(false);
      }
    });
  }, []);

  return (
    <>
      {!isLoading ? <Box px={[0, 5, 10, 20]} py={[5, 10]}>
        <Flex justify="space-between" mb="6">
          <Heading ml={[5, 0]} fontStyle="italic">Menù</Heading>
          {(isAuth && user?.role === UserRole.ADMIN) && <Button mr={[5, 0]} onClick={onOpen} colorScheme="yellow">Aggiungi</Button>}
        </Flex>
        <VStack w="100%" spacing="20">
          {itemsByType[ItemType.APETIZER].length > 0 &&
            <Box w="100%">
              <Heading textAlign="center" mb="6" color="yellow.400" size="lg">Apetizers</Heading>
              <SimpleGrid columns={[1, 1, 2, 3]} gap={[10, 5, 5]}>
                {itemsByType[ItemType.APETIZER].map(item => <GridItem key={item.id}><MenuItem updateItem={updateItem} item={item} isAdmin={user?.role === UserRole.ADMIN} removeItemFromMenu={removeItemFromMenu} /></GridItem>)}
              </SimpleGrid>
            </Box>
          }
          {itemsByType[ItemType.CLUB_SANDWICH].length > 0 &&
            <Box w="100%">
              <Heading textAlign="center" mb="6" color="yellow.400" size="lg">Club Sandwich</Heading>
              <SimpleGrid columns={[1, 1, 2, 3]} gap={[10, 5, 5]}>
                {itemsByType[ItemType.CLUB_SANDWICH].map(item => <GridItem key={item.id}><MenuItem updateItem={updateItem} item={item} isAdmin={user?.role === UserRole.ADMIN} removeItemFromMenu={removeItemFromMenu} /></GridItem>)}
              </SimpleGrid>
            </Box>
          }
          {itemsByType[ItemType.WRAP].length > 0 &&
            <Box w="100%">
              <Heading textAlign="center" mb="6" color="yellow.400" size="lg">Wrap</Heading>
              <SimpleGrid columns={[1, 1, 2, 3]} gap={[10, 5, 5]}>
                {itemsByType[ItemType.WRAP].map(item => <GridItem key={item.id}><MenuItem updateItem={updateItem} item={item} isAdmin={user?.role === UserRole.ADMIN} removeItemFromMenu={removeItemFromMenu} /></GridItem>)}
              </SimpleGrid>
            </Box>
          }
          {itemsByType[ItemType.BURGER].length > 0 &&
            <Box w="100%">
              <Heading textAlign="center" mb="6" color="yellow.400" size="lg">Burger</Heading>
              <SimpleGrid columns={[1, 1, 2, 3]} gap={[10, 5, 5]}>
                {itemsByType[ItemType.BURGER].map(item => <GridItem key={item.id}><MenuItem updateItem={updateItem} item={item} isAdmin={user?.role === UserRole.ADMIN} removeItemFromMenu={removeItemFromMenu} /></GridItem>)}
              </SimpleGrid>
            </Box>
          }
          {itemsByType[ItemType.DESSERT].length > 0 &&
            <Box w="100%">
              <Heading textAlign="center" mb="6" color="yellow.400" size="lg">Dessert</Heading>
              <SimpleGrid columns={[1, 1, 2, 3]} gap={[10, 5, 5]}>
                {itemsByType[ItemType.DESSERT].map(item => <GridItem key={item.id}><MenuItem updateItem={updateItem} item={item} isAdmin={user?.role === UserRole.ADMIN} removeItemFromMenu={removeItemFromMenu} /></GridItem>)}
              </SimpleGrid>
            </Box>
          }
          {itemsByType[ItemType.DRINK].length > 0 &&
            <Box w="100%">
              <Heading textAlign="center" mb="6" color="yellow.400" size="lg">Drink</Heading>
              <SimpleGrid columns={[1, 1, 2, 3]} gap={[10, 5, 5]}>
                {itemsByType[ItemType.DRINK].map(item => <GridItem key={item.id}><MenuItem updateItem={updateItem} item={item} isAdmin={user?.role === UserRole.ADMIN} removeItemFromMenu={removeItemFromMenu} /></GridItem>)}
              </SimpleGrid>
            </Box>
          }
        </VStack>
      </Box> :
        <LoadingPage />
      }
      <AddItem initialValues={createItemInitialValues} action="create" isOpen={isOpen} addItemToMenu={addItemToMenu} onClose={onClose} />
    </>
  );
}

export default Menu;
