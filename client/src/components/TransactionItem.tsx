import { Tag, TagLabel, TagLeftIcon, Td, Tr } from '@chakra-ui/react';
import { formatDate } from '../utils';
import { Transaction } from '../utils/types';
import { tagProps } from '../utils/vars';
import Link from './Link';

interface TransactionProps {
  transaction: Transaction,
  isDesktop: boolean
}

function TransactionItem({ transaction, isDesktop }: TransactionProps) {

  const { color, description, icon } = tagProps[transaction.state];

  return (
    <Tr>
      <Td>
        <Link to={`/order/${transaction.id}`}>{transaction.id}</Link>
      </Td>
      {isDesktop && <>
        <Td>{transaction.customer.email}</Td>
        <Td>
          <Tag colorScheme={color}>
            <TagLeftIcon as={icon} />
            <TagLabel>{description}</TagLabel>
          </Tag>
        </Td>
        <Td>{formatDate(transaction.dateTime)}</Td>
      </>}
      <Td isNumeric>{(transaction.amount).toFixed(2)} €</Td>
    </Tr>
  );
}

export default TransactionItem;