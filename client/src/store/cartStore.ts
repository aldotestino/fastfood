import create from 'zustand';
import { CartItem } from '../types';

interface CartStore {
  items: Array<CartItem>
  addItemToCart: (newItem: CartItem) => void
}

const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItemToCart: (newItem: CartItem) => set((state) => ({ items: [...state.items, newItem] })),
}));

export default useCartStore;
