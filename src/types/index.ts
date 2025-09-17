
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

export type SpiceLevel = 'none' | 'mild' | 'medium' | 'hot';

export type DietaryTag =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'spicy'
  | 'classic'
  | 'garden-fresh'
  | 'sweet-savory'
  | 'loaded'
  | 'bbq'
  | 'caffeine-free'
  | 'sugar-free';

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
  tags?: DietaryTag[];
  spiceLevel?: SpiceLevel;
  isVegetarian?: boolean;
}

export interface Drink {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  size: string;
  available: boolean;
  tags?: DietaryTag[];
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

export type PaymentMethod = 'cash' | 'card';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface OrderContactInfo {
  name: string;
  phone: string;
}

export interface OrderDeliveryDetails {
  address: string;
  instructions?: string;
}

export interface OrderPaymentDetails {
  method: PaymentMethod;
  status?: PaymentStatus;
}

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  phone?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  contact: OrderContactInfo;
  delivery: OrderDeliveryDetails;
  payment: OrderPaymentDetails;
}

export interface CheckoutSnapshot {
  items: CartItem[];
  total: number;
  createdAt: string;
}

export interface CreateOrderInput {
  userId: string;
  items: CartItem[];
  total: number;
  contact: OrderContactInfo;
  delivery: OrderDeliveryDetails;
  payment: OrderPaymentDetails;
}
