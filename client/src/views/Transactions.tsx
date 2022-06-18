import { Table, TableCaption, TableContainer, Tbody, Th, Thead, Tr, useMediaQuery, Heading, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { API_URL } from '../utils/vars';
import TransactionItem from '../components/TransactionItem';
import { NewOrderSocketEVent, OrderChangeSocketEvent, Transaction } from '../utils/types';
import LoadingPage from '../components/LoadingPage';
import { useSocket } from '../SocketProvider';

function Transactions() {

  const [transactions, setTransactions] = useState<Array<Transaction>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDesktop] = useMediaQuery('(min-width: 48em)');
  const ioSocket = useSocket();

  useEffect(() => {
    setIsLoading(true);
    fetch(`${API_URL}/order`, {
      credentials: 'include'
    }).then(r => r.json()).then(res => {
      if(res.success) {
        setTransactions(res.data.orders);
        setIsLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if(ioSocket?.current) {
      ioSocket.current.addListener('new-order', (data: NewOrderSocketEVent) => {
        const newTransaction: Transaction = {
          amount: data.amount,
          customer: {
            email: data.customerEmail
          },
          dateTime: data.dateTime,
          id: data.orderId,
          state: data.state
        };
        setTransactions(ps => [newTransaction, ...ps]);
      });

      ioSocket.current.addListener('order-taken', (data: OrderChangeSocketEvent) => {
        const newTransaction = transactions.map(t => {
          if(t.id === data.orderId) {
            t.state = data.state;
          }
          return t;
        });
        setTransactions(newTransaction);
      });

      ioSocket.current.addListener('order-closed', (data: OrderChangeSocketEvent) => {
        const newTransaction = transactions.map(t => {
          if(t.id === data.orderId) {
            t.state = data.state;
          }
          return t;
        });
        setTransactions(newTransaction);
      });
    }

    return () => {
      if(ioSocket?.current) {
        ioSocket.current.removeAllListeners();
      }
    };
  }, [transactions]);

  return (
    <>
      {!isLoading ? 
        <TableContainer px={[0, 5, 10, 20]} py={[5, 10]}>
          <Flex justify="space-between">
            <Heading ml={[5, 0]} mb="6" fontStyle="italic">Transazioni</Heading>
          </Flex>
          <Table variant="striped">
            {transactions.length === 0 && <TableCaption>Non ci sono transazioni</TableCaption>}
            <Thead>
              <Tr>
                <Th>ID</Th>
                {isDesktop && <>
                  <Th>Cliente</Th>
                  <Th>Stato</Th>
                  <Th>Data</Th>
                </>}
                <Th isNumeric>Importo</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactions.map(t => <TransactionItem key={t.id} transaction={t} isDesktop={isDesktop} />)}
            </Tbody>
          </Table> 
        </TableContainer> :    
        <LoadingPage/>       
      }
    </>
  );
}

export default Transactions;
