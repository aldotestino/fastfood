import { CheckIcon, CloseIcon, TimeIcon  } from '@chakra-ui/icons';
import { Stat, StatHelpText, StatLabel, StatNumber, Tag, TagLabel, TagLeftIcon, Button, HStack } from '@chakra-ui/react';
import { Link as RLink } from 'react-router-dom';
import { formatDate } from '../utils';
import { OrderSummary, OrderState } from '../utils/types';

const tagProps = {
  [OrderState.PENDING]: {
    description: 'In attesa',
    color: 'yellow',
    icon: TimeIcon
  },
  [OrderState.TAKEN]: {
    description: 'In preparazione',
    color: 'green',
    icon: CheckIcon
  },
  [OrderState.CLOSED]: {
    description: 'Chiuso',
    color: 'red',
    icon: CloseIcon
  }
};

interface OrderCardProps extends OrderSummary {
  showButton: boolean
}

function OrderCard({ amount, dateTime, showButton=true, state, id }: OrderCardProps) {

  const { color, description, icon } = tagProps[state];

  return (
    <HStack w={showButton ? '100%' : 'auto'} justify="space-between">
      <Stat>
        <StatLabel>
          <Tag colorScheme={color}>
            <TagLeftIcon as={icon} />
            <TagLabel>{description}</TagLabel>
          </Tag>
        </StatLabel>
        <StatNumber py={2}>{amount.toFixed(2)} €</StatNumber>
        <StatHelpText>{formatDate(dateTime)}</StatHelpText>
      </Stat>
      {showButton && <Button as={RLink} to={`/order/${id}`}>Vai ai dettagli</Button>}
    </HStack>
  );  
}

export default OrderCard;