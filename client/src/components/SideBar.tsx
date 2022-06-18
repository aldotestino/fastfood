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

          {!isAuth || user?.role === UserRole.ADMIN ? 
            <DrawerHeader>Naviga</DrawerHeader> : 
            <DrawerHeader>
              <HStack>
                <Avatar user={user} />
                <Text>Ciao, {user!.customer?.firstName || user?.cook?.email.split('@')[0]}</Text>
              </HStack>
            </DrawerHeader>}

          <DrawerBody>
            <VStack as="ul" alignItems="start" spacing="5">
              {!isAuth ? 
                <>
                  <Link to="/chi-siamo" fontSize="lg" onClick={onClose}>Chi siamo</Link>
                  <Link to="/menu" fontSize="lg" onClick={onClose}>Menù</Link>
                  <Link to="/contatti" fontSize="lg" onClick={onClose}>Contatti</Link>
                  <Link to="/login" fontSize="lg" onClick={onClose}>Login</Link>
                  <Cart onClick={onClose} />
                </> : user?.role === UserRole.CUSTOMER ? 
                  <>
                    <Link to="/profile" fontSize="lg" onClick={onClose}>Profilo</Link>
                    <ButtonLink fontSize="lg" action={() => {handleLogout(); onClose();}} onClick={onClose}>Logout</ButtonLink>
                    <Divider />
                    <Link to="/chi-siamo" fontSize="lg" onClick={onClose}>Chi siamo</Link>
                    <Link to="/menu" fontSize="lg" onClick={onClose}>Menù</Link>
                    <Link to="/contatti" fontSize="lg" onClick={onClose}>Contatti</Link>
                    <Cart onClick={onClose} />
                  </> : user?.role === UserRole.COOK ? 
                    <>
                      <ButtonLink action={handleLogout} fontSize="lg" onClick={onClose}>Logout</ButtonLink>
                    </> :
                    <>
                      <ButtonLink action={handleLogout} fontSize="lg" onClick={onClose}>Logout</ButtonLink>
                      <Divider />
                      <Link to="/" fontSize="lg" onClick={onClose}>Transazioni</Link>
                      <Link to="/menu" fontSize="lg" onClick={onClose}>Menù</Link>
                      <Link to="/cooks" fontSize="lg" onClick={onClose}>Cuochi</Link>
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