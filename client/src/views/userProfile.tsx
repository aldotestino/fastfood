import { Box, Heading, HStack, VStack, Text, Tabs, TabList, TabPanels, TabPanel, Tab, Divider } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import OrderCard from '../components/OrderCard';
import useUserStore from '../store/userStore';
import { OrderSummary, UserRole } from '../utils/types';
import { API_URL } from '../utils/vars';

interface UserOrders {
  activeOrders: Array<OrderSummary>
  archivedOrders: Array<OrderSummary>
}

function UserProfile() {

  const { isAuth, user } = useUserStore();
  const [orders, setOrders] = useState<UserOrders>();

  useEffect(() => {
    fetch(`${API_URL}/customer/orders`, {
      credentials: 'include'
    }).then(r => r.json()).then(res => {
      if(res.success) {
        setOrders({
          activeOrders: res.data.activeOrders,
          archivedOrders: res.data.archivedOrders
        });
      }
    });
  }, []);

  return (
    <Box px={[5, 5, 10, 20]} py={[5, 10]}>
      {!isAuth && <Navigate to="/login" />}
      <HStack spacing="4" mb="6">
        <Avatar size={['xl', '2xl']} user={user} />
        <VStack align="flex-start">
          <Heading size={['lg', 'xl']}>Ciao, {user?.customer?.firstName || user?.cook?.email}</Heading>
          {user?.role === UserRole.CUSTOMER && <Text fontSize="xl">{user.customer?.email}</Text>}
        </VStack>
      </HStack>
      <Tabs isLazy variant='enclosed' colorScheme="yellow">
        <TabList>
          <Tab>Ordini attivi</Tab>
          <Tab>Ordini archiviati</Tab>
        </TabList>
        <TabPanels>
          <TabPanel as={VStack} align="flex-start" divider={<Divider />}>
            {orders?.activeOrders.map(o => <OrderCard key={o.id} o={o} />)}
          </TabPanel>
          <TabPanel as={VStack} align="flex-start" divider={<Divider />}>
            {orders?.archivedOrders.map(o => <OrderCard key={o.id} o={o} />)}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default UserProfile;