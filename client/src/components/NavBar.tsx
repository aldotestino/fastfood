import { Button, Flex, Heading, HStack, Menu, MenuButton, MenuItem, MenuList, useColorMode, useMediaQuery } from '@chakra-ui/react';
import { Link as RLink, useNavigate } from 'react-router-dom';
import Cart from './Cart';
import Link from './Link';
import useUserStore from '../store/userStore';
import SideBar from './SideBar';
import Avatar from './Avatar';
import { UserRole } from '../utils/types';
import ColorModeSwitcher from './ColorModeSwitcher';

function NavBar() {

  const [isDesktop] = useMediaQuery('(min-width: 48em)');
  const navigate = useNavigate();
  const { colorMode } = useColorMode(); 
  
  const { user, isAuth, logout } = useUserStore();
  
  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <Flex px={[5, 5, 10, 20]} zIndex={1000} h={20} shadow="lg" w="100%" align="center" justify="space-between" bg={colorMode === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(26,32,44,0.9)'} backdropFilter="blur(5px)" pos="sticky" top={0}>
      {isDesktop ?
        <>
          <HStack as="ul" spacing="5">
            <Heading as={RLink} fontStyle="italic" to="/" size="xl">Vctmang</Heading>
            {!isAuth || user?.role === UserRole.CUSTOMER ?
              <>
                <Link to="/chi-siamo" fontSize="lg">Chi siamo</Link>
                <Link to="/menu" fontSize="lg">Menù</Link>
                <Link to="/contatti" fontSize="lg">Contatti</Link>
              </> : user?.role === UserRole.ADMIN ?
                <>
                  <Link to="/" fontSize="lg">Transazioni</Link>  
                  <Link to="/menu">Menù</Link>
                  <Link to="/cooks">Cuochi</Link> 
                </>: null
            }
          </HStack>
          <HStack spacing="5">
            {(!isAuth || user?.role === UserRole.CUSTOMER) && <Cart />}
            <ColorModeSwitcher />
            {!isAuth ? 
              <Button as={RLink} to="/login" colorScheme="yellow">Login</Button> :
              <Menu>
                <Avatar user={user!} as={MenuButton} />
                <MenuList>
                  {user?.role === UserRole.CUSTOMER && 
                    <MenuItem as={RLink} to="/profile">Profilo</MenuItem>
                  }
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            }
          </HStack>
        </>
        :
        <>
          <SideBar isAuth={isAuth} user={user} handleLogout={handleLogout} />
          <Heading as={RLink} to="/" fontStyle="italic" size="xl">Vctmang</Heading>
          <ColorModeSwitcher />
        </>
      }
    </Flex>
  );
}

export default NavBar;
