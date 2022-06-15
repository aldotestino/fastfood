import { Divider, Drawer, DrawerBody, Text, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, HStack, Icon, IconButton, useDisclosure, VStack } from '@chakra-ui/react';
import Link from './Link';
import ButtonLink from './ButtonLink';
import { MenuAlt2Icon } from '@heroicons/react/outline';
import { RefObject, useRef } from 'react';
import { User, UserRole } from '../utils/types';
import Cart from './Cart';
import Avatar from './Avatar';

interface SideBarProps {
  isAuth: boolean
  user: User | null
  handleLogout: () => void
}

function SideBar({ isAuth, user, handleLogout }: SideBarProps) {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef() as RefObject<HTMLButtonElement>;

  return (
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

          {!isAuth ? 
            <DrawerHeader>Naviga</DrawerHeader> : 
            <DrawerHeader>
              <HStack>
                <Avatar user={user} />
                <Text>Ciao, {user!.customer?.firstName || user?.cook?.email.split('@')[0]}</Text>
              </HStack>
            </DrawerHeader>}

          <DrawerBody>
            <VStack as="ul" alignItems="start" spacing="5">
              {user !== null && 
              <>
                {user.role !== UserRole.COOK && <Link to="/profile" onClick={onClose}>Profilo</Link>}
                <ButtonLink action={handleLogout} onClick={onClose}>Logout</ButtonLink>
                <Divider />
              </>}
              {user?.role !== UserRole.COOK && 
                <>
                  <Link to="/chi-siamo" fontSize="lg" onClick={onClose}>Chi siamo</Link>
                  <Link to="/menu" fontSize="lg" onClick={onClose}>Menù</Link>
                  <Link to="/contatti" fontSize="lg" onClick={onClose}>Contatti</Link>
                  {!isAuth && <Link to="/login" fontSize="lg" onClick={onClose}>Login</Link>}
                  <Cart onClick={onClose} />
                </>
              }
            </VStack>
          </DrawerBody>

        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideBar;