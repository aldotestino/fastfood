import { Item } from '../utils/types';
import { Box, Heading, GridItem, SimpleGrid } from '@chakra-ui/react';
import MenuItem from '../components/MenuItem';
import { useEffect, useState } from 'react';
import { API_URL } from '../utils/vars';

function Menu() {

  const [items, setItems] = useState<Array<Item>>([]);

  useEffect(() => {
    fetch(`${API_URL}/menu`).then(raw => raw.json()).then((res) => {
      if(res.success) {
        console.log(res);
        setItems(res.data.menu);
      }
    });
  }, []);

  return (
    <Box px={[0, 5, 10, 20]} py={[5, 10]}>
      <Heading ml={[5, 0]} mb="6" fontStyle="italic">Menù</Heading>
      <SimpleGrid columns={[1, 1, 2, 3]} gap={[10, 5, 5]}>
        {items.map((item, i) => <GridItem key={i}><MenuItem {...item} /></GridItem>)}
      </SimpleGrid>
    </Box>
  );
}

export default Menu;
