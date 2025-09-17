
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, CreateOrderInput } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface OrderState {
  orders: Order[];
  placeOrder: (orderInput: CreateOrderInput) => string;
  getUserOrders: (userId: string) => Order[];
  getAllOrders: () => Order[];
  updateOrderStatus: (orderId: string, status: 'pending' | 'processing' | 'completed' | 'cancelled') => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      
      placeOrder: ({ userId, items, total, contact, delivery, payment }) => {
        const clonedItems = items.map(item => ({
          ...item,
          pizza: item.pizza
            ? {
                ...item.pizza,
                toppings: [...item.pizza.toppings],
              }
            : undefined,
          drink: item.drink ? { ...item.drink } : undefined,
        }));

        const newOrder: Order = {
          id: uuidv4(),
          userId,
          items: clonedItems,
          total,
          status: 'pending',
          createdAt: new Date().toISOString(),
          contact: {
            name: contact.name.trim(),
            phone: contact.phone.trim(),
          },
          delivery: {
            address: delivery.address.trim(),
            instructions: delivery.instructions?.trim() || undefined,
          },
          payment: {
            method: payment.method,
            status: payment.status ?? 'pending',
          },
        };

        set(state => ({
          orders: [...state.orders, newOrder]
        }));
        
        return newOrder.id;
      },
      
      getUserOrders: (userId) => {
        return get().orders.filter(order => order.userId === userId);
      },
      
      getAllOrders: () => {
        return get().orders;
      },
      
      updateOrderStatus: (orderId, status) => {
        set(state => ({
          orders: state.orders.map(order => 
            order.id === orderId ? { ...order, status } : order
          )
        }));
      }
    }),
    {
      name: 'pizza-order-storage',
      version: 1,
      migrate: (persistedState: unknown, version) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return { orders: [] };
        }

        if (version === 0) {
          const state = persistedState as { orders?: Order[] };
          return {
            ...state,
            orders: (state.orders ?? []).map(order => ({
              ...order,
              contact: order.contact ?? {
                name: '',
                phone: '',
              },
              delivery: order.delivery ?? {
                address: '',
                instructions: undefined,
              },
              payment: order.payment ?? {
                method: 'cash',
                status: 'pending',
              },
            })),
          };
        }

        return persistedState;
      },
    }
  )
);
