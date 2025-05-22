
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { CartItem, CartPizzaItem, CartDrinkItem, PizzaSize } from '../types';
import { pizzas } from '../data/pizzas';
import { drinks } from '../data/drinks';
import { toppings } from '../data/toppings';

interface CartStore {
  items: CartItem[];
  addPizzaToCart: (pizzaId: string, size: PizzaSize, selectedToppings: string[], quantity: number) => void;
  addDrinkToCart: (drinkId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateItemQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addPizzaToCart: (pizzaId, size, selectedToppings, quantity) => {
        const cartItem: CartItem = {
          id: uuidv4(),
          type: 'pizza',
          pizza: {
            pizzaId,
            size,
            toppings: selectedToppings,
            quantity,
          },
        };
        
        set((state) => ({
          items: [...state.items, cartItem],
        }));
      },
      
      addDrinkToCart: (drinkId, quantity) => {
        const cartItem: CartItem = {
          id: uuidv4(),
          type: 'drink',
          drink: {
            drinkId,
            quantity,
          },
        };
        
        set((state) => ({
          items: [...state.items, cartItem],
        }));
      },
      
      removeFromCart: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== cartItemId),
        }));
      },
      
      updateItemQuantity: (cartItemId, quantity) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === cartItemId) {
              if (item.type === 'pizza' && item.pizza) {
                return {
                  ...item,
                  pizza: {
                    ...item.pizza,
                    quantity,
                  },
                };
              } else if (item.type === 'drink' && item.drink) {
                return {
                  ...item,
                  drink: {
                    ...item.drink,
                    quantity,
                  },
                };
              }
            }
            return item;
          }),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          if (item.type === 'pizza' && item.pizza) {
            const pizza = pizzas.find(p => p.id === item.pizza?.pizzaId);
            if (pizza) {
              let pizzaPrice = pizza.price[item.pizza.size] * item.pizza.quantity;
              
              // Add topping prices
              item.pizza.toppings.forEach(toppingId => {
                const topping = toppings.find(t => t.id === toppingId);
                if (topping) {
                  pizzaPrice += topping.price[item.pizza!.size] * item.pizza!.quantity;
                }
              });
              
              return total + pizzaPrice;
            }
          } else if (item.type === 'drink' && item.drink) {
            const drink = drinks.find(d => d.id === item.drink?.drinkId);
            if (drink) {
              return total + (drink.price * item.drink.quantity);
            }
          }
          return total;
        }, 0);
      }
    }),
    {
      name: 'pizza-cart-storage',
    }
  )
);
