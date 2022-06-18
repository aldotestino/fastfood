import { Item, ItemType, UserRole } from '../utils/types';
import { Box, Heading, GridItem, SimpleGrid, VStack } from '@chakra-ui/react';
import MenuItem from '../components/MenuItem';
import { useEffect, useState } from 'react';
import { API_URL } from '../utils/vars';
import LoadingPage from '../components/LoadingPage';
import useUserStore from '../store/userStore';

interface Items {
  ['Wrap']: Array<Item>
  ['Burger']: Array<Item>
  ['Drink']: Array<Item>
  ['Club Sandwich']: Array<Item>
}

function Menu() {

  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Items>({
    ['Club Sandwich']: [],
    ['Wrap']: [],
    ['Burger']: [],
    ['Drink']: []
  });

  const { user } = useUserStore();

  useEffect(() => {
    fetch(`${API_URL}/menu`).then(raw => raw.json()).then((res) => {
      if(res.success) {
        setItems({
          ['Club Sandwich']: res.data.menu.filter((i: Item) => i.type === ItemType.CLUB_SANDWICH),
          ['Wrap']: res.data.menu.filter((i: Item) => i.type === ItemType.WRAP),
          ['Burger']: res.data.menu.filter((i: Item) => i.type === ItemType.BURGER),
          ['Drink']: res.data.menu.filter((i: Item) => i.type === ItemType.DRINK)
        });
        setIsLoading(false);
      }
    });
  }, []);

  return (
    <>
      {!isLoading ? <Box px={[0, 5, 10, 20]} py={[5, 10]}>
        <Heading ml={[5, 0]} fontStyle="italic">Menù</Heading>
        <VStack w="100%" spacing="20">
          {
            Object.entries(items).map(([key, list]: [string,  Array<Item>]) => 
              <Box w="100%" key={key}>
                <Heading textAlign="center" mb="6" color="yellow.400" size="lg">{key}</Heading>
                <SimpleGrid columns={[1, 1, 2, 3]} gap={[10, 5, 5]}>
                  {list.map((item, i) => <GridItem key={i}><MenuItem item={item} isAdmin={user?.role === UserRole.ADMIN} /></GridItem>)}
                </SimpleGrid>
              </Box>
            )
          }
        </VStack>
      </Box> :
        <LoadingPage />
      }
    </>
  );
}

export default Menu;
