import { CheckIcon, CloseIcon, TimeIcon  } from '@chakra-ui/icons';
import { Stat, StatHelpText, StatLabel, StatNumber, Tag, TagLabel, TagLeftIcon, Button, HStack, StackProps } from '@chakra-ui/react';
import { Link as RLink } from 'react-router-dom';
import { formatDate } from '../utils';
import { OrderSummary } from '../utils/types';
import { tagProps } from '../utils/vars';

interface OrderCardProps extends StackProps {
  o: OrderSummary,
  showButton?: boolean
}

function OrderCard({ o, showButton=true, ...rest }: OrderCardProps) {

  const { color, description, icon } = tagProps[o.state];

  return (
    <HStack {...rest} w={showButton ? '100%' : 'auto'} justify="space-between">
      <Stat>
        <StatLabel>
          <Tag colorScheme={color}>
            <TagLeftIcon as={icon} />
            <TagLabel>{description}</TagLabel>
          </Tag>
        </StatLabel>
        <StatNumber py={2}>{o.amount.toFixed(2)} €</StatNumber>
        <StatHelpText>{formatDate(o.dateTime)}</StatHelpText>
      </Stat>
      {showButton && <Button as={RLink} to={`/order/${o.id}`}>Vai ai dettagli</Button>}
    </HStack>
  );  
}

export default OrderCard;