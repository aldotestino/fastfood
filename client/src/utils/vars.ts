import { CheckIcon, CloseIcon, TimeIcon } from '@chakra-ui/icons';
import { OrderState } from './types';

export const SERVER_URL = 'http://192.168.1.101:3001';
export const API_URL = `${SERVER_URL}/api/v1`;
export const IMAGE_URL = `${SERVER_URL}/images/items`;

export const tagProps = {
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