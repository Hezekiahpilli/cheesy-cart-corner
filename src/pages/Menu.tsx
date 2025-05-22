
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PizzaCard from '@/components/PizzaCard';
import DrinkCard from '@/components/DrinkCard';
import { pizzas } from '@/data/pizzas';
import { drinks } from '@/data/drinks';

const Menu = () => {
  const [activeTab, setActiveTab] = useState('pizzas');

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 font-display">Our Menu</h1>
      
      <Tabs defaultValue="pizzas" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-6">
          <TabsList>
            <TabsTrigger value="pizzas" className="px-8">Pizzas</TabsTrigger>
            <TabsTrigger value="drinks" className="px-8">Drinks</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="pizzas">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pizzas.map(pizza => (
              <PizzaCard key={pizza.id} pizza={pizza} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="drinks">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {drinks.map(drink => (
              <DrinkCard key={drink.id} drink={drink} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Menu;
