import create from 'zustand';
import shallow from 'zustand/shallow';
import { CartItem } from '../utils/types';

interface CartStore {
  items: Array<CartItem>
  addItemToCart: (newItem: CartItem) => void
  deleteItemFromCart: (id: string) => void
  total: () => number
}

const useStore = create<CartStore>((setState, getState) => ({
  items: [],
  addItemToCart: (newItem) => setState(state => ({ items: [...state.items, newItem] })),
  deleteItemFromCart: (id) => setState(state => ({ items: state.items.filter(i => i.id !== id) })),
  total: () => getState().items.reduce((sum, i) => sum += i.item.price*i.quantity, 0)
}));

function useCartStore() {
  return useStore(({ items, addItemToCart, deleteItemFromCart, total }) => ({ items, addItemToCart, deleteItemFromCart, total }), shallow);
}

export default useCartStore;
