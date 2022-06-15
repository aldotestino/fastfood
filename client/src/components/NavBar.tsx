import { Button, Flex, Heading, HStack, Menu, MenuButton, MenuDivider, MenuItem, MenuList, useMediaQuery } from '@chakra-ui/react';
import { Link as RLink, useNavigate } from 'react-router-dom';
import Cart from './Cart';
import Link from './Link';
import useUserStore from '../store/userStore';
import SideBar from './SideBar';
import Avatar from './Avatar';
import { UserRole } from '../utils/types';

function NavBar() {

  const [isDesktop] = useMediaQuery('(min-width: 48em)');
  const navigate = useNavigate();
  
  const { user, isAuth, logout } = useUserStore();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <Flex px={[5, 5, 10, 20]} zIndex={1000} h={20} shadow="lg" w="100%" align="center" justify="space-between" bg="whiteAlpha.800" backdropFilter="blur(5px)" pos="sticky" top={0}>
      {isDesktop ?
        <>
          <HStack as="ul" spacing="5">
            <Heading as={RLink} fontStyle="italic" to="/" size="xl">Vctmang</Heading>
            {user?.role !== UserRole.COOK && 
            <>
              <Link to="/chi-siamo" fontSize="lg">Chi siamo</Link>
              <Link to="/menu" fontSize="lg">Menù</Link>
              <Link to="/contatti" fontSize="lg">Contatti</Link>
            </>}
          </HStack>
          <HStack spacing="5">
            {user?.role !== UserRole.COOK && <Cart />}
            {!isAuth ? 
              <Button as={RLink} to="/login" colorScheme="yellow">Login</Button> :
              <Menu>
                <Avatar user={user!} as={MenuButton} />
                <MenuList>
                  {user?.role !== UserRole.COOK && 
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
          <span></span>
        </>
      }
    </Flex>
  );
}

export default NavBar;
