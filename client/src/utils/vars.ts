import { CheckIcon, CloseIcon, TimeIcon } from '@chakra-ui/icons';
import { OrderState } from './types';

export const SERVER_URL = process.env.NODE_ENV === 'production' ? 'https://api.vcetmang.online' : 'http://192.168.1.101:3001';
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

export const ingredientsOptions = [
  { 
    label: 'Hamburger di scottona', 
    value: 'Hamburger di scottona' 
  }, 
  { label: 'Pulled pork', 
    value: 'Pulled pork' 
  }, 
  { label: 'Pulled chicken', 
    value: 'Pulled chicken' 
  }, 
  { label: 'Porchetta', 
    value: 'Porchetta' 
  }, 
  { label: 'Salame piccante', 
    value: 'Salame piccante' 
  }, 
  { label: 'Salmone affumicato', 
    value: 'Salmone affumicato' 
  }, 
  { label: 'Petto di pollo', 
    value: 'Petto di pollo' 
  },
  { label: 'Polpo', 
    value: 'Polpo' 
  }, 
  { label: 'Black angus', 
    value: 'Black angus' 
  },
  { label: 'Bacon croccante', 
    value: 'Bacon croccante' 
  },
  {
    label: 'Bacon',
    value: 'Bacon'
  },
  { label: 'Uovo', 
    value: 'Uovo' 
  }, 
  { label: 'Insalata', 
    value: 'Insalata' 
  }, { label: 'Pomodoro', 
    value: 'Pomodoro' 
  }, 
  { label: 'Funghi', 
    value: 'Funghi' 
  }, 
  { label: 'Cheddar', 
    value: 'Cheddar' 
  }, 
  { label: 'Patate al forno', 
    value: 'Patate al forno' 
  }, 
  { label: 'Ketchup', 
    value: 'Ketchup' 
  }, 
  { label: 'Mayo', 
    value: 'Mayo' 
  }, 
  { label: 'Salsa agrodolce', 
    value: 'Salsa agrodolce' 
  },
  {
    label: 'Salsa BBQ',
    value: 'Salsa BBQ'
  },
  {
    label: 'Cioccolato',
    value: 'Cioccolato'
  }
];