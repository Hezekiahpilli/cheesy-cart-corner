
import { useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PizzaCard from '@/components/PizzaCard';
import DrinkCard from '@/components/DrinkCard';
import { pizzas } from '@/data/pizzas';
import { drinks } from '@/data/drinks';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { getTagLabel } from '@/lib/tag-utils';

const Menu = () => {
  const [activeTab, setActiveTab] = useState('pizzas');
  const priceStats = useMemo(() => {
    const pizzaBasePrices = pizzas.map(pizza => Math.min(...Object.values(pizza.price)));
    const drinkPrices = drinks.map(drink => drink.price);
    const combined = [...pizzaBasePrices, ...drinkPrices].filter(price => typeof price === 'number');

    if (combined.length === 0) {
      return { floor: 0, ceiling: 0 };
    }

    const floor = Math.floor(Math.min(...combined));
    const ceiling = Math.ceil(Math.max(...combined));

    return { floor, ceiling: ceiling || floor };
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [maxPrice, setMaxPrice] = useState(priceStats.ceiling);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();

    pizzas.forEach(pizza => {
      pizza.tags?.forEach(tag => tags.add(tag));

      if (pizza.isVegetarian) {
        tags.add('vegetarian');
      }

      if (pizza.spiceLevel === 'medium' || pizza.spiceLevel === 'hot') {
        tags.add('spicy');
      }
    });

    drinks.forEach(drink => {
      drink.tags?.forEach(tag => tags.add(tag));
    });

    return Array.from(tags).sort((a, b) => getTagLabel(a).localeCompare(getTagLabel(b)));
  }, []);

  const filteredPizzas = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return pizzas.filter(pizza => {
      const lowestPrice = Math.min(...Object.values(pizza.price));

      if (lowestPrice > maxPrice) {
        return false;
      }

      if (
        normalized &&
        ![pizza.name, pizza.description].some(field => field.toLowerCase().includes(normalized))
      ) {
        return false;
      }

      if (selectedTags.length === 0) {
        return true;
      }

      return selectedTags.every(tag => {
        if (tag === 'vegetarian') {
          return Boolean(pizza.isVegetarian);
        }

        if (tag === 'spicy') {
          return pizza.spiceLevel === 'medium' || pizza.spiceLevel === 'hot';
        }

        return pizza.tags?.includes(tag);
      });
    });
  }, [maxPrice, searchTerm, selectedTags]);

  const filteredDrinks = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return drinks.filter(drink => {
      if (drink.price > maxPrice) {
        return false;
      }

      if (
        normalized &&
        ![drink.name, drink.description].some(field => field.toLowerCase().includes(normalized))
      ) {
        return false;
      }

      if (selectedTags.length === 0) {
        return true;
      }

      return selectedTags.every(tag => drink.tags?.includes(tag));
    });
  }, [maxPrice, searchTerm, selectedTags]);

  const handleMaxPriceChange = (value: number[]) => {
    const nextPrice = value[0];
    setMaxPrice(nextPrice !== undefined ? nextPrice : priceStats.ceiling);
  };

  const handleTagSelection = (value: string[]) => {
    setSelectedTags(value);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 font-display">Our Menu</h1>

      <div className="mb-8 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="menu-search">Search menu</Label>
            <Input
              id="menu-search"
              type="search"
              placeholder="Search for pizzas or drinks..."
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="price-filter">Maximum price</Label>
            <div className="px-1">
              <Slider
                id="price-filter"
                min={Math.max(0, priceStats.floor)}
                max={priceStats.ceiling}
                step={0.5}
                value={[maxPrice]}
                onValueChange={handleMaxPriceChange}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>${Math.max(0, priceStats.floor).toFixed(2)}</span>
              <span>Up to ${maxPrice.toFixed(2)}</span>
              <span>${priceStats.ceiling.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Dietary tags</Label>
          {availableTags.length ? (
            <ToggleGroup
              type="multiple"
              value={selectedTags}
              onValueChange={handleTagSelection}
              className="flex flex-wrap justify-start gap-2"
            >
              {availableTags.map(tag => (
                <ToggleGroupItem
                  key={tag}
                  value={tag}
                  aria-label={getTagLabel(tag)}
                  variant="outline"
                  size="sm"
                  className="capitalize data-[state=on]:bg-pizza-600 data-[state=on]:text-white"
                >
                  {getTagLabel(tag)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          ) : (
            <p className="text-sm text-muted-foreground">No tags available yet.</p>
          )}
        </div>
      </div>

      <Tabs defaultValue="pizzas" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList>
            <TabsTrigger value="pizzas" className="px-8">Pizzas</TabsTrigger>
            <TabsTrigger value="drinks" className="px-8">Drinks</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="pizzas">
          {filteredPizzas.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPizzas.map(pizza => (
                <PizzaCard key={pizza.id} pizza={pizza} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
              No pizzas match your filters. Try adjusting your search or filters.
            </div>
          )}
        </TabsContent>

        <TabsContent value="drinks">
          {filteredDrinks.length ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredDrinks.map(drink => (
                <DrinkCard key={drink.id} drink={drink} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
              No drinks match your filters. Try adjusting your search or filters.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Menu;
