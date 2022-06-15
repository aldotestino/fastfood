import { Box, Divider, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingPage from '../components/LoadingPage';
import OrderCard from '../components/OrderCard';
import OrderItem from '../components/OrderItem';
import useUserStore from '../store/userStore';
import { Order, UserRole } from '../utils/types';
import { API_URL } from '../utils/vars';

function OrderView() {

  const { orderId } = useParams();
  const [order, setOrder] = useState<Order>();
  const { user } = useUserStore();

  useEffect(() => {
    fetch(`${API_URL}/order/${orderId}`, {
      credentials: 'include'
    }).then(r => r.json()).then(res => {
      setOrder(res.data.order);
    });
  }, []);
  
  return (
    <>
      {order !== null && order !== undefined ? 
        <Box px={[5, 5, 10, 20]} py={[5, 10]}>
          <Flex w="100%" justify="space-between" mb="6">
            <VStack spacing={2} align="flex-start">
              <Heading fontStyle="italic">
                Ordine 
              </Heading>
              <Text fontSize={['xs', 'lg']}>#{order?.id}</Text>
              {user?.role !== UserRole.COOK && order.cook && <Text fontSize="lg">{order.cook.email.split('@')[0]} si sta prendendo cura del tuo ordine.</Text>}
            </VStack>
            <OrderCard showButton={false} id={order.id} amount={order.amount} state={order.state} dateTime={order.dateTime} />
          </Flex>
          <VStack spacing="4" align="flex-start" divider={<Divider />}>
            {order.items.map(o => <OrderItem key={o.item.id} {...o} />)}
          </VStack>
        </Box> :
        <LoadingPage />
      }
    </>
  );
}

export default OrderView;