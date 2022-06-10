import { Badge, Stat, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react';
import { formatDate } from '../utils';
import { Order, OrderState } from '../utils/types';

const badgeColor = {
  [OrderState.PENDING]: 'yellow',
  [OrderState.TAKEN]: 'green',
  [OrderState.CLOSED]: 'red'
};

function OrderCard(order: Order) {

  const orderState = order.state === OrderState.CLOSED ? 'Chiuso' : order.state === OrderState.PENDING ? 'In attesa' : 'In preparazione'; 

  return (
    <Stat>
      <StatLabel as={Badge} colorScheme={badgeColor[order.state]}>{orderState}</StatLabel>
      <StatNumber py={2}>{order.amount.toFixed(2)} €</StatNumber>
      <StatHelpText>{formatDate(order.dateTime)}</StatHelpText>
    </Stat>
  );
}

export default OrderCard;