import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, CheckoutSnapshot } from '../types';

interface CheckoutState {
  snapshot: CheckoutSnapshot | null;
  setSnapshot: (items: CartItem[], total: number) => void;
  clearSnapshot: () => void;
}

const cloneCartItems = (items: CartItem[]): CartItem[] =>
  items.map(item => ({
    ...item,
    pizza: item.pizza
      ? {
          ...item.pizza,
          toppings: [...item.pizza.toppings],
        }
      : undefined,
    drink: item.drink ? { ...item.drink } : undefined,
  }));

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      snapshot: null,
      setSnapshot: (items, total) => {
        set({
          snapshot: {
            items: cloneCartItems(items),
            total,
            createdAt: new Date().toISOString(),
          },
        });
      },
      clearSnapshot: () => set({ snapshot: null }),
    }),
    {
      name: 'pizza-checkout-storage',
    }
  )
);
