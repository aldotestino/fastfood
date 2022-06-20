import { createContext, MutableRefObject, ReactNode, useContext, useEffect, useRef } from 'react';
import { Text, useToast } from '@chakra-ui/react';
import socketio, { Socket } from 'socket.io-client';
import useUserStore from './store/userStore';
import { OrderChangeSocketEvent, NewOrderSocketEVent, OrderState, UserRole } from './utils/types';
import { SERVER_URL } from './utils/vars';
import Link from './components/Link';
import { EventEmitter } from 'fbemitter';

const SocketContext = createContext<MutableRefObject<EventEmitter | null> | null>(null);

function useSocket() {
  return useContext(SocketContext);
}

interface SocketProviderProps {
  children: ReactNode
}

function SocketProvider({ children }: SocketProviderProps) {
  const ioSocket = useRef<Socket | null | undefined>();
  const emitter = useRef<EventEmitter | null>(new EventEmitter());
  const { user } = useUserStore();

  const toast = useToast();

  useEffect(() => {
    if(user !== null) {
      if(ioSocket.current === null || ioSocket.current === undefined) {
        ioSocket.current = socketio(SERVER_URL);
      }

      if(user.role === UserRole.CUSTOMER && user.customer) {
        ioSocket.current.on(user.customer.id, (data: OrderChangeSocketEvent) => {
          
          if(data.state === OrderState.PENDING) {
            emitter.current?.emit('new-order', data)
          }else if(data.state === OrderState.TAKEN) {
            emitter.current?.emit('order-taken', data);
          }else {
            emitter.current?.emit('order-closed', data);
          }
          
          const title = data.state === OrderState.TAKEN ? 'Ordine in preparazione' : 'Ordine chiuso';
          const description = data.state === OrderState.TAKEN ? 
            <Text>
              <Link noColor to={`/order/${data.orderId}`}>Il tuo ordine</Link> è stato preso in carico da <span style={{ textTransform: 'capitalize' }}>{data.cookEmail.split('@')[0]}</span>
            </Text> :
            <Text>
              <Link noColor to={`/order/${data.orderId}`}>Il tuo ordine</Link> è stato chiuso da <span style={{ textTransform: 'capitalize' }}>{data.cookEmail.split('@')[0]}</span>
            </Text>;

          toast({
            title,
            description,
            status: 'info',
            duration: 3000,
            isClosable: true,
            position: 'top-right'
          });

        });
      }else if(user.role === UserRole.COOK && user.cook) {

        ioSocket.current.on('order-taken', (data: OrderChangeSocketEvent) => {
          emitter.current?.emit('order-taken', data);
        });

        ioSocket.current.on(user.cook?.id, (data: OrderChangeSocketEvent) => {
          emitter.current?.emit('order-closed', data);
        });

        ioSocket.current.on('new-order', (data: NewOrderSocketEVent) => {
          emitter.current?.emit('new-order', data);
        });

      }else if(user.role === UserRole.ADMIN && user.admin) {
        ioSocket.current.on('order-taken', (data: OrderChangeSocketEvent) => {
          emitter.current?.emit('order-taken', data);
        });

        ioSocket.current.on(user.admin.id, (data: OrderChangeSocketEvent) => {
          emitter.current?.emit('order-closed', data);
        });

        ioSocket.current.on('new-order', (data: NewOrderSocketEVent) => {
          emitter.current?.emit('new-order', data);
        });
      }
    }

    return () => {
      ioSocket.current?.disconnect();
      ioSocket.current = null;
    };
  }, [user]);

  return (
    <SocketContext.Provider value={emitter}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
export { useSocket };