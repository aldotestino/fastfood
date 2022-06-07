import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Heading, HStack, Icon, IconButton, useDisclosure, useMediaQuery, VStack } from '@chakra-ui/react';
import { useRef, RefObject } from 'react';
import { Link as RLink } from 'react-router-dom';
import { MenuAlt2Icon } from '@heroicons/react/outline';
import Cart from './Cart';
import Link from './Link';

function NavBar() {

  const [isDesktop] = useMediaQuery('(min-width: 48em)');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef() as RefObject<HTMLButtonElement>;

  return (
    <Flex px={[5, 5, 10, 20]} zIndex={1000} h={20} shadow="lg" w="100%" align="center" justify="space-between" bg="whiteAlpha.800" backdropFilter="blur(5px)" pos="sticky" top={0}>
      {isDesktop ?
        <>
          <HStack as="ul" spacing="5">
            <Heading as={RLink} fontStyle="italic" to="/" size="xl">FastFood</Heading>
            <Link to="/chi-siamo" fontSize="lg">Chi siamo</Link>
            <Link to="/menu" fontSize="lg">Menù</Link>
            <Link to="/contatti" fontSize="lg">Contatti</Link>
          </HStack>
          <HStack spacing="5">
            <Cart />
            <Button as={RLink} to="/login" colorScheme="yellow">Login</Button>
          </HStack>
        </>
        :
        <>
          <IconButton ref={btnRef} aria-label='menu' icon={<Icon as={MenuAlt2Icon} />} colorScheme='yellow' onClick={onOpen} />
          <Drawer
            isOpen={isOpen}
            placement='left'
            onClose={onClose}
            finalFocusRef={btnRef}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />

              <DrawerHeader>Naviga</DrawerHeader>

              <DrawerBody>
                <VStack as="ul" alignItems="start" spacing="5">
                  <Link to="/chi-siamo" fontSize="lg">Chi siamo</Link>
                  <Link to="/menu" fontSize="lg">Menù</Link>
                  <Link to="/contatti" fontSize="lg">Contatti</Link>
                  <Link to="/login" fontSize="lg">Login</Link>
                  <Cart />
                </VStack>
              </DrawerBody>

            </DrawerContent>
          </Drawer>
          <Heading as={RLink} to="/" size="xl">FastFood</Heading>
          <span></span>
        </>
      }
    </Flex>
  );
}

export default NavBar;
