import { Box, Heading, HStack, VStack, Text, Tabs, TabList, TabPanels, TabPanel, Tab, Divider, Spinner, Center } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import OrderCard from '../components/OrderCard';
import { useSocket } from '../SocketProvider';
import useUserStore from '../store/userStore';
import { NewOrderSocketEVent, OrderChangeSocketEvent, OrderSummary } from '../utils/types';
import { API_URL } from '../utils/vars';

interface UserOrders {
  activeOrders: Array<OrderSummary>
  archivedOrders: Array<OrderSummary>
}

function CustomerProfile() {

  const { isAuth, user } = useUserStore();
  const [orders, setOrders] = useState<UserOrders>({
    activeOrders: [],
    archivedOrders: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const ioSocket = useSocket();

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
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if(ioSocket?.current) {

      ioSocket.current.addListener('new-order', (data: NewOrderSocketEVent) => {
        const newOrder: OrderSummary = {
          id: data.orderId,
          amount: data.amount,
          dateTime: data.dateTime,
          state: data.state
        };

        setOrders(ps => ({
          ...ps,
          activeOrders: [newOrder, ...ps.activeOrders]
        }));
      });

      ioSocket.current?.addListener('order-taken', (data: OrderChangeSocketEvent) => {
        const newActiveOrders = orders.activeOrders.map(o => {
          if(o.id === data.orderId) {
            o.state = data.state;
          }
          return o;
        });

        setOrders(ps => ({
          ...ps,
          activeOrders: newActiveOrders
        }));
      });

      ioSocket.current?.addListener('order-closed', (data: OrderChangeSocketEvent) => {
        const closedOrder = orders.activeOrders.find(o => o.id === data.orderId);
        if(closedOrder) {
          closedOrder.state = data.state;
          const newActiveOrders = orders.activeOrders.filter(o => o.id !== data.orderId);
          const newArchivedOrders = [closedOrder, ...orders.archivedOrders];
          setOrders({
            activeOrders: newActiveOrders,
            archivedOrders: newArchivedOrders
          });
        }
      });
    }


    return () => {
      if(ioSocket?.current) {
        ioSocket.current.removeAllListeners();
      }
    };
  }, [orders]);

  return (
    <Box px={[5, 5, 10, 20]} py={[5, 10]}>
      {!isAuth && <Navigate to="/login" />}
      <HStack spacing="4" mb="6">
        <Avatar size={['xl', '2xl']} user={user} />
        <VStack align="flex-start">
          <Heading size={['lg', 'xl']}>Ciao, {user?.customer?.firstName}</Heading>
          <Text fontSize="xl">{user?.customer?.email}</Text>
        </VStack>
      </HStack>
      <Tabs isLazy variant="enclosed" colorScheme="yellow">
        <TabList>
          <Tab>Ordini attivi</Tab>
          <Tab>Ordini archiviati</Tab>
        </TabList>
        {!isLoading ? <TabPanels>
          <TabPanel as={VStack} align="flex-start" divider={<Divider />}>
            {orders?.activeOrders.map(o => <OrderCard key={o.id} o={o} />)}
          </TabPanel>
          <TabPanel as={VStack} align="flex-start" divider={<Divider />}>
            {orders?.archivedOrders.map(o => <OrderCard key={o.id} o={o} />)}
          </TabPanel>
        </TabPanels> : 
          <Center mt="20">
            <Spinner color="yellow.400" size="xl" />
          </Center>
        }
      </Tabs>
    </Box>
  );
}

export default CustomerProfile;