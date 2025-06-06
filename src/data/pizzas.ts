
import { Pizza } from '../types';

export const pizzas: Pizza[] = [
  {
    id: '1',
    name: 'Margherita',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil',
    image: '/placeholder.svg',
    price: {
      small: 8.99,
      medium: 10.99,
      large: 12.99,
    },
    availableToppings: ['1', '2', '3', '4', '5', '6', '7', '8']
  },
  {
    id: '2',
    name: 'Pepperoni',
    description: 'Pizza topped with tomato sauce, mozzarella, and pepperoni slices',
    image: '/placeholder.svg',
    price: {
      small: 9.99,
      medium: 11.99,
      large: 13.99,
    },
    availableToppings: ['1', '2', '3', '4', '5', '6', '7', '8']
  },
  {
    id: '3',
    name: 'Vegetarian',
    description: 'Pizza with tomato sauce, mozzarella, bell peppers, mushrooms, and olives',
    image: '/placeholder.svg',
    price: {
      small: 9.99,
      medium: 11.99,
      large: 13.99,
    },
    availableToppings: ['1', '2', '3', '5', '7', '8']
  },
  {
    id: '4',
    name: 'Hawaiian',
    description: 'Pizza with tomato sauce, mozzarella, ham, and pineapple',
    image: '/placeholder.svg',
    price: {
      small: 10.99,
      medium: 12.99,
      large: 14.99,
    },
    availableToppings: ['1', '2', '3', '4', '5', '6', '7', '8']
  },
  {
    id: '5',
    name: 'Supreme',
    description: 'Pizza with tomato sauce, mozzarella, pepperoni, sausage, bell peppers, onions, and mushrooms',
    image: '/placeholder.svg',
    price: {
      small: 11.99,
      medium: 13.99,
      large: 15.99,
    },
    availableToppings: ['1', '2', '3', '4', '5', '6', '7', '8']
  },
  {
    id: '6',
    name: 'BBQ Chicken',
    description: 'Pizza with BBQ sauce, mozzarella, grilled chicken, red onions, and cilantro',
    image: '/placeholder.svg',
    price: {
      small: 11.99,
      medium: 13.99,
      large: 15.99,
    },
    availableToppings: ['1', '2', '3', '4', '5', '6', '7', '8']
  }
];
