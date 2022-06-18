import { Box, Divider, Flex, Heading, Text, VStack, IconButton, HStack, useMediaQuery, Button } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingPage from '../components/LoadingPage';
import OrderCard from '../components/OrderCard';
import OrderItem from '../components/OrderItem';
import useUserStore from '../store/userStore';
import { Order, OrderChangeSocketEvent, OrderState, UserRole } from '../utils/types';
import { API_URL } from '../utils/vars';
import { useSocket } from '../SocketProvider';

function OrderView() {

  const { orderId } = useParams();
  const [order, setOrder] = useState<Order>({
    amount: 0,
    cook: {
      id: '',
      email: ''
    },
    customer: {
      id: '',
      email: ''
    },
    dateTime: '',
    id: '',
    items: [],
    state: OrderState.PENDING
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [isDesktop] = useMediaQuery('(min-width: 48em)');
  const ioSocket = useSocket();

  useEffect(() => {
    fetch(`${API_URL}/order/${orderId}`, {
      credentials: 'include'
    }).then(r => r.json()).then(res => {
      if(res.success) {
        setOrder(res.data.order);
      }else {
        navigate(user?.customer ? '/profile': '/');
      }
    });
  }, [orderId]);


  useEffect(() => {
    if(ioSocket?.current) {
      ioSocket.current.addListener('order-taken', (data: OrderChangeSocketEvent) => {
        if(order.id === data.orderId) {
          if(user?.cook && user.cook.id !== data.cookId) {
            navigate('/');
          }
  
          setOrder(ps => ({
            ...ps,
            cook: {
              email: data.cookEmail,
              id: data.cookId
            },
            state: data.state,
          }));
        }
      });

      ioSocket.current.addListener('order-closed', (data: OrderChangeSocketEvent) => {
        if(order.id === data.orderId) {
          setOrder(ps => ({
            ...ps,
            state: data.state
          }));
        }
      });
    }

    return () => {
      if(ioSocket?.current) {
        ioSocket.current.removeAllListeners();
      }
    };
  }, [order]);

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
        ...ps,
        state: res.data.order.state
      }));
    }
  }
  return (
    <>
      {!isLoading ? 
        <Box px={[5, 5, 10, 20]} py={[5, 10]}>
          <Flex w="100%" justify="space-between" mb="6">
            <VStack spacing={2} align="flex-start">
              <HStack>
                <IconButton onClick={() => navigate(user?.role === UserRole.COOK || user?.role === UserRole.ADMIN ? '/' : '/profile')} variant="ghost" aria-label='go back' icon={<ArrowBackIcon w="6" h="6"/>} />
                <Heading fontStyle="italic">
                  Ordine
                </Heading>
              </HStack>
              {(user?.role === UserRole.ADMIN || user?.role === UserRole.COOK) && <Text>da <span style={{ fontWeight: 'bold' }}>{order.customer.email}</span></Text>}
              {user?.role === UserRole.COOK && order.state !== OrderState.CLOSED && (order.state === OrderState.PENDING ? 
                <Button isLoading={isLoading} onClick={() => changeOrderState(OrderState.TAKEN)}>Prendi ordine</Button> : 
                <Button isLoading={isLoading} onClick={() => changeOrderState(OrderState.CLOSED)}>Chiudi ordine</Button>)}
              {(user?.role === UserRole.CUSTOMER && order.cook) && <Text fontSize="lg"><span style={{ fontWeight: 'bold', fontStyle: 'italic', textTransform: 'capitalize' }}>{order.cook.email.split('@')[0]}</span> {order.state === OrderState.TAKEN ? 'sta preparando il tuo ordine.': 'ha chiuso il tuo ordine.'}</Text>}
              {(user?.role === UserRole.ADMIN && order.cook) && <Text fontSize="lg"><span style={{ fontWeight: 'bold', fontStyle: 'italic', textTransform: 'capitalize' }}>{order.cook.email.split('@')[0]}</span> {order.state === OrderState.TAKEN ? 'sta preparando l\'ordine.': 'ha chiuso l\'ordine.'}</Text>}
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