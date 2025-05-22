
export type PizzaSize = 'small' | 'medium' | 'large';

export interface Topping {
  id: string;
  name: string;
  price: {
    small: number;
    medium: number;
    large: number;
  };
  available: boolean;
}

export interface Pizza {
  id: string;
  name: string;
  description: string;
  image: string;
  price: {
    small: number;
    medium: number;
    large: number;
  };
  availableToppings: string[]; // IDs of available toppings
}

export interface Drink {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  size: string;
  available: boolean;
}

export interface CartPizzaItem {
  pizzaId: string;
  size: PizzaSize;
  toppings: string[]; // IDs of selected toppings
  quantity: number;
}

export interface CartDrinkItem {
  drinkId: string;
  quantity: number;
}

export interface CartItem {
  id: string;
  type: 'pizza' | 'drink';
  pizza?: CartPizzaItem;
  drink?: CartDrinkItem;
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}
