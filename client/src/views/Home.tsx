import { Heading, Button, Text, Center, VStack, Image, Flex } from '@chakra-ui/react';
import { Link as RLink } from 'react-router-dom';
import HomeImage from '../assets/home_image_2.avif';

function Home() {
  return (
    <Flex>
      <Image display={['none', 'none', 'block']} src={HomeImage} h="calc(100vh - 80px)"/>
      <Center w="100%" h="calc(100vh - 80px)">
        <VStack spacing="6" >
          <Heading size={['2xl', '2xl', '2xl', '4xl']} textAlign="center">Mangia a modo tuo!</Heading>
          <Text fontSize={['2xl', '2xl', '2xl', '3xl']} fontWeight="light" align="center">Scegli tra i tanti prodotti <br /> disponibili nel nostro menù</Text>
          <Button size="lg" colorScheme="yellow" as={RLink} to="/menu">Vai al menù</Button>
        </VStack>
      </Center>
    </Flex>
  );
}

export default Home;