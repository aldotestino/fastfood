import create from 'zustand';
import { CartItem } from '../utils/types';

interface CartStore {
  items: Array<CartItem>
  addItemToCart: (newItem: CartItem) => void
  deleteItemFromCart: (id: string) => void
  total: () => number
}

const useCartStore = create<CartStore>((setState, getState) => ({
  items: [],
  addItemToCart: (newItem: CartItem) => setState(state => ({ items: [...state.items, newItem] })),
  deleteItemFromCart: (id: string) => setState(state => ({ items: state.items.filter(i => i.id !== id) })),
  total: () => getState().items.reduce((sum, i) => sum += i.item.price*i.quantity, 0)
}));

export default useCartStore;
