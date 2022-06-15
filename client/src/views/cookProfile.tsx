import { Box, Heading, HStack, VStack, Text, Tabs, TabList, TabPanels, TabPanel, Tab, Divider } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import OrderCard from '../components/OrderCard';
import useUserStore from '../store/userStore';
import { OrderSummary, OrderState, UserRole } from '../utils/types';
import { API_URL } from '../utils/vars';

interface Orders {
  myOrders: Array<OrderSummary>
  pendingOrders: Array<OrderSummary>
}

function CookProfile() {

  const { isAuth, user } = useUserStore();
  const [orders, setOrders] = useState<Orders>();

  useEffect(() => {
    fetch(`${API_URL}/cook/orders`, {
      credentials: 'include'
    }).then(r => r.json()).then(res => {
      if(res.success) {
        setOrders({
          myOrders: res.data.myOrders,
          pendingOrders: res.data.pendingOrders
        });
      }
    });
  }, []);

  return (
    <Box px={[5, 5, 10, 20]} py={[5, 10]}>
      {!isAuth && <Navigate to="/login" />}
      <HStack spacing="4" mb="6">
        <VStack align="flex-start">
          <Heading size={['lg', 'xl']}>Ciao, {user?.customer?.firstName || user?.cook?.email}</Heading>
          {user?.role === UserRole.CUSTOMER && <Text fontSize="xl">{user.customer?.email}</Text>}
        </VStack>
      </HStack>
      <Tabs isLazy variant='enclosed' colorScheme="yellow">
        <TabList>
          <Tab>Ordini disponibili</Tab>
          <Tab>I miei ordini</Tab>
        </TabList>
        <TabPanels>
          <TabPanel as={VStack} align="flex-start" divider={<Divider />}>
            {orders?.pendingOrders.filter(o => o.state === OrderState.PENDING || o.state === OrderState.TAKEN).map(o => <OrderCard key={o.id} {...o} />)}
          </TabPanel>
          <TabPanel as={VStack} align="flex-start" divider={<Divider />}>
            {orders?.myOrders.filter(o => o.state === OrderState.CLOSED).map(o => <OrderCard key={o.id} {...o} />)}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}

export default CookProfile;