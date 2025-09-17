
import { useMemo, useState } from 'react';
import { Pizza, Topping, PizzaSize } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toppings as allToppings } from '@/data/toppings';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { getTagBadgeVariant, getTagLabel } from '@/lib/tag-utils';

interface PizzaCardProps {
  pizza: Pizza;
}

const PizzaCard = ({ pizza }: PizzaCardProps) => {
  const [size, setSize] = useState<PizzaSize>('medium');
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { addPizzaToCart } = useCartStore();
  
  const availableToppings = allToppings.filter(topping =>
    pizza.availableToppings.includes(topping.id) && topping.available
  );

  const displayTags = useMemo(() => {
    const tags = new Set<string>(pizza.tags ?? []);

    if (pizza.isVegetarian) {
      tags.add('vegetarian');
    }

    if (pizza.spiceLevel === 'medium' || pizza.spiceLevel === 'hot') {
      tags.add('spicy');
    }

    return Array.from(tags);
  }, [pizza]);

  const formatBadgeLabel = (tag: string) => {
    if (tag === 'spicy') {
      if (pizza.spiceLevel === 'hot') {
        return 'Extra Spicy';
      }

      return 'Spicy';
    }

    return getTagLabel(tag);
  };

  const handleToppingToggle = (toppingId: string) => {
    setSelectedToppings(prev => 
      prev.includes(toppingId)
        ? prev.filter(id => id !== toppingId)
        : [...prev, toppingId]
    );
  };
  
  const handleAddToCart = () => {
    addPizzaToCart(pizza.id, size, selectedToppings, quantity);
    toast.success('Added to cart!');
    setIsDialogOpen(false);
    resetSelections();
  };
  
  const resetSelections = () => {
    setSize('medium');
    setQuantity(1);
    setSelectedToppings([]);
  };
  
  const calculateTotalPrice = () => {
    let total = pizza.price[size] * quantity;
    
    // Add topping prices
    selectedToppings.forEach(toppingId => {
      const topping = allToppings.find(t => t.id === toppingId);
      if (topping) {
        total += topping.price[size] * quantity;
      }
    });
    
    return total.toFixed(2);
  };
  
  return (
    <div className="pizza-card h-full flex flex-col">
      <div className="aspect-video rounded-lg overflow-hidden mb-3">
        <img
          src={pizza.image}
          alt={pizza.name}
          className="w-full h-full object-cover"
        />
      </div>
      {displayTags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {displayTags.map(tag => (
            <Badge key={tag} variant={getTagBadgeVariant(tag)}>
              {formatBadgeLabel(tag)}
            </Badge>
          ))}
        </div>
      )}
      <h3 className="text-lg font-semibold">{pizza.name}</h3>
      <p className="text-gray-600 text-sm mb-2 flex-1">{pizza.description}</p>
      <div className="flex justify-between items-center mt-auto pt-3">
        <span className="font-semibold">From ${pizza.price.small.toFixed(2)}</span>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" className="bg-pizza-600 hover:bg-pizza-700">Order</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl">{pizza.name}</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-1/3">
                  <img
                    src={pizza.image}
                    alt={pizza.name}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                </div>
                
                <div className="md:w-2/3">
                  <p className="text-gray-600 mb-4">{pizza.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="size">Size</Label>
                      <Select value={size} onValueChange={(value) => setSize(value as PizzaSize)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small - ${pizza.price.small.toFixed(2)}</SelectItem>
                          <SelectItem value="medium">Medium - ${pizza.price.medium.toFixed(2)}</SelectItem>
                          <SelectItem value="large">Large - ${pizza.price.large.toFixed(2)}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center">
                      <Label htmlFor="quantity" className="mr-4">Quantity</Label>
                      <div className="flex border rounded-md">
                        <Button
                          type="button"
                          variant="ghost"
                          className="px-3 h-10"
                          onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                        >
                          -
                        </Button>
                        <div className="px-3 h-10 flex items-center justify-center min-w-[40px]">
                          {quantity}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          className="px-3 h-10"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Toppings selection */}
              <div>
                <h4 className="font-medium mb-2">Additional toppings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {availableToppings.map((topping) => (
                    <div key={topping.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`topping-${topping.id}`}
                        checked={selectedToppings.includes(topping.id)}
                        onCheckedChange={() => handleToppingToggle(topping.id)}
                      />
                      <Label htmlFor={`topping-${topping.id}`} className="text-sm cursor-pointer">
                        {topping.name} (+${topping.price[size].toFixed(2)})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center border-t pt-4">
                <div className="font-semibold">
                  Total: ${calculateTotalPrice()}
                </div>
                
                <Button 
                  onClick={handleAddToCart} 
                  className="bg-pizza-600 hover:bg-pizza-700"
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PizzaCard;
