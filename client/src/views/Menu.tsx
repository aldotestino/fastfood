import { Item, ItemType } from '../utils/types';
import { Box, Heading, GridItem, SimpleGrid } from '@chakra-ui/react';
import MenuItem from '../components/MenuItem';
import { useEffect, useState } from 'react';
import { API_URL } from '../utils/vars';

interface Items {
  ['Wrap']: Array<Item>
  ['Burger']: Array<Item>
  ['Drink']: Array<Item>
  ['Club Sandwich']: Array<Item>
}

function Menu() {

  const [items, setItems] = useState<Items>({
    ['Club Sandwich']: [],
    ['Wrap']: [],
    ['Burger']: [],
    ['Drink']: []
  });

  useEffect(() => {
    fetch(`${API_URL}/menu`).then(raw => raw.json()).then((res) => {
      if(res.success) {
        setItems({
          ['Club Sandwich']: res.data.menu.filter((i: Item) => i.type === ItemType.CLUB_SANDWICH),
          ['Wrap']: res.data.menu.filter((i: Item) => i.type === ItemType.WRAP),
          ['Burger']: res.data.menu.filter((i: Item) => i.type === ItemType.BURGER),
          ['Drink']: res.data.menu.filter((i: Item) => i.type === ItemType.DRINK)
        });
      }
    });
  }, []);

  return (
    <Box px={[0, 5, 10, 20]} py={[5, 10]}>
      <Heading ml={[5, 0]} fontStyle="italic">Menù</Heading>
      <Box>
        {
          Object.entries(items).map(([key, list]: [string,  Array<Item>]) => 
            <Box key={key}>
              <Heading textAlign="center" mt="6" mb="6" color="yellow.400" size="lg">{key}</Heading>
              <SimpleGrid columns={[1, 1, 2, 3]} gap={[10, 5, 5]}>
                {list.map((item, i) => <GridItem key={i}><MenuItem {...item} /></GridItem>)}
              </SimpleGrid>
            </Box>
          )
        }
      </Box>
    </Box>
  );
}

export default Menu;
