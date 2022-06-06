import BurgerAcdc from '../assets/food/burger_acdc.png';
import BurgerLedZeppelin from '../assets/food/burger_ledzeppelin.png';
import BurgerMetallica from '../assets/food/burger_metallica.png';
import BurgerTheDoors from '../assets/food/burger_thedoors.png';
import BurgerSexPistols from '../assets/food/burger_sexpistols.png';
import WrapCindy from '../assets/food/wrap_cindy.png';
import { Food } from '../utils/types';
import { Box, Heading, GridItem, SimpleGrid } from '@chakra-ui/react';
import MenuItem from '../components/MenuItem';

const burgers: Food[] = [
  {
    name: 'Burger Ac/Dc',
    price: 10,
    image: BurgerAcdc
  },
  {
    name: 'Burger Led Zeppelin',
    price: 12,
    image: BurgerLedZeppelin
  },
  {
    name: 'Burger Metallica',
    price: 8,
    image: BurgerMetallica
  },
  {
    name: 'Burger The Doors',
    price: 10,
    image: BurgerTheDoors
  },
  {
    name: 'Burger Sex Pistols',
    price: 9,
    image: BurgerSexPistols
  },
  {
    name: 'Wrap Cindy',
    price: 5,
    image: WrapCindy
  }
];

function Menu() {

  return (
    <Box px={[0, 5, 10, 20]} py={[5, 10]}>
      <Heading ml={[5, 0]} mb="6" fontStyle="italic">Menù</Heading>
      <SimpleGrid columns={[1, 1, 2, 3]} gap={[10, 5, 5]}>
        {burgers.map((b, i) => <GridItem key={i}><MenuItem {...b} /></GridItem>)}
      </SimpleGrid>
    </Box>
  );
}

export default Menu;
