import { Box, Heading, HStack, VStack, Text, Tabs, TabList, TabPanels, TabPanel, Tab, Divider, Center, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import OrderCard from '../components/OrderCard';
import useUserStore from '../store/userStore';
import { OrderSummary } from '../utils/types';
import { API_URL } from '../utils/vars';

interface Orders {
  myOrders: Array<OrderSummary>
  pendingOrders: Array<OrderSummary>
}

function CookProfile() {

  const { isAuth, user } = useUserStore();
  const [orders, setOrders] = useState<Orders>();
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(false);
    });
  }, []);

  return (
    <Box px={[5, 5, 10, 20]} py={[5, 10]}>
      {!isAuth && <Navigate to="/login" />}
      <HStack spacing="4" mb="6">
        <VStack align="flex-start">
          <Heading size={['lg', 'xl']}>Ciao, <span style={{ textTransform: 'capitalize' }}>{user?.cook?.email.split('@')[0]}</span></Heading>
        </VStack>
      </HStack>
      <Tabs isLazy variant='enclosed' colorScheme="yellow">
        <TabList>
          <Tab>Ordini disponibili</Tab>
          <Tab>I miei ordini</Tab>
        </TabList>
        {!isLoading ? <TabPanels>
          <TabPanel as={VStack} align="flex-start" divider={<Divider />}>
            {orders?.pendingOrders.map(o => <OrderCard key={o.id} o={o} />)}
          </TabPanel>
          <TabPanel as={VStack} align="flex-start" divider={<Divider />}>
            {orders?.myOrders.map(o => <OrderCard key={o.id} o={o} />)}
          </TabPanel>
        </TabPanels> :
          <Center mt="20">
            <Spinner color="yellow.400" size="xl" />
          </Center>}
      </Tabs>
    </Box>
  );
}

export default CookProfile;