import { CheckIcon, CloseIcon, TimeIcon  } from '@chakra-ui/icons';
import { Stat, StatHelpText, StatLabel, StatNumber, Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react';
import { formatDate } from '../utils';
import { Order, OrderState } from '../utils/types';

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

function OrderCard({ amount, dateTime, state }: Order) {

  const { color, description, icon } = tagProps[state];

  return (
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
  );
}

export default OrderCard;