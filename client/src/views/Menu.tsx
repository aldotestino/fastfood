import BurgerAcdc from '../assets/food/burger_acdc.png';
import BurgerLedZeppelin from '../assets/food/burger_ledzeppelin.png';
import BurgerMetallica from '../assets/food/burger_metallica.png';
import { Food } from '../types';
import { Box, Heading, GridItem, SimpleGrid } from '@chakra-ui/react';
import MenuItem from '../components/MenuItem';

const burgers: Food[] = [
  {
    name: 'Ac/Dc',
    price: 10,
    image: BurgerAcdc
  },
  {
    name: 'Led Zeppelin',
    price: 12,
    image: BurgerLedZeppelin
  },
  {
    name: 'Metallica',
    price: 8,
    image: BurgerMetallica
  }
];

function Menu() {

  return (
    <Box p={[5, 10]}>
      <Heading textAlign="center" size="3xl" mb={[5, 10]}>Menù</Heading>
      <SimpleGrid columns={[1, 1, 2, 3]} gap={[10, 5, 5]}>
        {burgers.map((b, i) => <GridItem key={i}><MenuItem {...b} /></GridItem>)}
      </SimpleGrid>
    </Box>
  );
}

export default Menu;
