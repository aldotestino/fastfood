import create from 'zustand';
import shallow from 'zustand/shallow';
import { CartItem } from '../utils/types';

interface CartStore {
  items: Array<CartItem>
  addItemToCart: (newItem: CartItem) => void
  deleteItemFromCart: (id: string) => void,
  clearCart: () => void,
  total: () => number
}

const useStore = create<CartStore>((setState, getState) => ({
  items: [],
  addItemToCart: (newItem) => setState(state => ({ items: [...state.items, newItem] })),
  deleteItemFromCart: (id) => setState(state => ({ items: state.items.filter(i => i.id !== id) })),
  clearCart: () => setState({ items: [] }),
  total: () => getState().items.reduce((sum, i) => sum += i.item.price*i.quantity, 0),
}));

function useCartStore() {
  return useStore(({ items, addItemToCart, deleteItemFromCart, clearCart, total }) => ({ items, addItemToCart, deleteItemFromCart, clearCart, total }), shallow);
}

export default useCartStore;
