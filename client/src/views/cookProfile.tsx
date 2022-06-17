import { Box, Heading, HStack, VStack, Tabs, TabList, TabPanels, TabPanel, Tab, Divider, Center, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import OrderCard from '../components/OrderCard';
import { useSocket } from '../SocketProvider';
import useUserStore from '../store/userStore';
import { NewOrderSocketEVent, OrderChangeSocketEvent, OrderState, OrderSummary } from '../utils/types';
import { API_URL } from '../utils/vars';

interface Orders {
  myOrders: Array<OrderSummary>
  pendingOrders: Array<OrderSummary>
}

function CookProfile() {

  const { isAuth, user } = useUserStore();
  const [orders, setOrders] = useState<Orders>({
    myOrders: [],
    pendingOrders: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const ioSocket = useSocket();

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
          pendingOrders: [newOrder, ...ps.pendingOrders]
        }));
      });

      ioSocket.current.addListener('order-taken', (data: OrderChangeSocketEvent) => {
        const takenOrder = orders.pendingOrders.find(o => o.id === data.orderId);
        const newPendingOrders = orders.pendingOrders.filter(o => o.id !== data.orderId);
        let myNewOrders = orders.myOrders;
        if(user?.cook && data.cookId === user.cook.id && takenOrder) {
          takenOrder.state = data.state;
          myNewOrders = [takenOrder, ...orders.myOrders];
        }

        setOrders({
          myOrders: myNewOrders,
          pendingOrders: newPendingOrders
        });
      });

      ioSocket.current.addListener('order-closed', (data: OrderChangeSocketEvent) => {
        const myNewOrders = orders.myOrders.map(o => {
          if(o.id === data.orderId) {
            o.state = data.state;
          }
          return o;
        });

        setOrders(ps => ({
          ...ps,
          myOrders: myNewOrders
        }));
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