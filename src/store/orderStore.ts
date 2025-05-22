
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Order, CartItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface OrderState {
  orders: Order[];
  placeOrder: (userId: string, items: CartItem[], total: number) => string;
  getUserOrders: (userId: string) => Order[];
  getAllOrders: () => Order[];
  updateOrderStatus: (orderId: string, status: 'pending' | 'processing' | 'completed' | 'cancelled') => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      
      placeOrder: (userId, items, total) => {
        const newOrder: Order = {
          id: uuidv4(),
          userId,
          items: [...items],
          total,
          status: 'pending',
          createdAt: new Date().toISOString(),
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
    }
  )
);
