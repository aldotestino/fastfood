import { Box, Divider, Flex, Heading, Text, VStack, IconButton, HStack, useMediaQuery, Button } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingPage from '../components/LoadingPage';
import OrderCard from '../components/OrderCard';
import OrderItem from '../components/OrderItem';
import useUserStore from '../store/userStore';
import { Order, OrderState, UserRole } from '../utils/types';
import { API_URL } from '../utils/vars';

function OrderView() {

  const { orderId } = useParams();
  const [order, setOrder] = useState<Order>();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [isDesktop] = useMediaQuery('(min-width: 48em)');

  useEffect(() => {
    fetch(`${API_URL}/order/${orderId}`, {
      credentials: 'include'
    }).then(r => r.json()).then(res => {
      if(res.success) {
        setOrder(res.data.order);
      }else {
        navigate('/profile');
      }
    });
  }, []);

  async function changeOrderState(state: OrderState.TAKEN | OrderState.CLOSED) {
    const changeState = {
      [OrderState.TAKEN]: 'take-order',
      [OrderState.CLOSED]: 'close-order'
    };
    setIsLoading(true);
    const res = await fetch(`${API_URL}/cook/${changeState[state]}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orderId: order?.id }),
      credentials: 'include'
    }).then(r => r.json());
    setIsLoading(false);
    if(res.success) {
      setOrder(ps => ({
        ...ps!,
        state: res.data.order.state
      }));
    }
  }
  
  return (
    <>
      {order !== null && order !== undefined ? 
        <Box px={[5, 5, 10, 20]} py={[5, 10]}>
          <Flex w="100%" justify="space-between" mb="6">
            <VStack spacing={2} align="flex-start">
              <HStack>
                <IconButton onClick={() => navigate(-1)} variant="ghost" aria-label='go back' icon={<ArrowBackIcon w="6" h="6"/>} />
                <Heading fontStyle="italic">
                  Ordine
                </Heading>
              </HStack>
              {user?.role === UserRole.COOK && order.state !== OrderState.CLOSED && (order.state === OrderState.PENDING ? 
                <Button isLoading={isLoading} onClick={() => changeOrderState(OrderState.TAKEN)}>Prendi ordine</Button> : 
                <Button isLoading={isLoading} onClick={() => changeOrderState(OrderState.CLOSED)}>Chiudi ordine</Button>)}
              {user?.role !== UserRole.COOK && order.cook && <Text fontSize="lg"><span style={{ fontWeight: 'bold', fontStyle: 'italic', textTransform: 'capitalize' }}>{order.cook.email.split('@')[0]}</span> {order.state === OrderState.TAKEN ? 'sta preparando il tuo ordine.': 'ha chiuso il tuo ordine.'}</Text>}
            </VStack>
            <OrderCard ml="4" showButton={false} o={order} />
          </Flex>
          <VStack spacing="4" align="flex-start" divider={<Divider />}>
            {order.items.map(o => <OrderItem isDesktop={isDesktop} key={o.item.id} {...o} />)}
          </VStack>
        </Box> :
        <LoadingPage />
      }
    </>
  );
}

export default OrderView;