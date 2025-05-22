
import { useState } from 'react';
import { Drink } from '@/types';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

interface DrinkCardProps {
  drink: Drink;
}

const DrinkCard = ({ drink }: DrinkCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addDrinkToCart } = useCartStore();

  const handleAddToCart = () => {
    addDrinkToCart(drink.id, quantity);
    toast.success('Drink added to cart!');
    setQuantity(1);
  };

  return (
    <div className="pizza-card h-full flex flex-col">
      <div className="aspect-video rounded-lg overflow-hidden mb-3">
        <img
          src={drink.image}
          alt={drink.name}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-lg font-semibold">{drink.name}</h3>
      <p className="text-gray-600 text-sm">{drink.description}</p>
      <p className="text-gray-500 text-sm mt-1">{drink.size}</p>
      <div className="flex justify-between items-center mt-auto pt-3">
        <span className="font-semibold">${drink.price.toFixed(2)}</span>
        
        <div className="flex items-center">
          <div className="flex border rounded-md mr-2">
            <Button
              type="button"
              variant="ghost"
              className="px-2 h-9"
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            >
              -
            </Button>
            <div className="px-2 h-9 flex items-center justify-center min-w-[30px]">
              {quantity}
            </div>
            <Button
              type="button"
              variant="ghost"
              className="px-2 h-9"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>
          
          <Button
            onClick={handleAddToCart}
            className="bg-pizza-600 hover:bg-pizza-700 h-9 px-3"
            size="sm"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DrinkCard;
