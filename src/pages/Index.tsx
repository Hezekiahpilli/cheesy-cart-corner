
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { pizzas } from '@/data/pizzas';

const Index = () => {
  const featuredPizzas = pizzas.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pizza-600 to-pizza-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-display">
                Delicious Pizza <br />
                <span className="text-yellow-300">Delivered to You</span>
              </h1>
              <p className="text-lg md:text-xl mb-6 max-w-md">
                Handcrafted with fresh ingredients and baked to perfection. Customize your pizza just the way you like it!
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="bg-white text-pizza-600 hover:bg-yellow-100 text-lg px-8 py-6 h-auto font-semibold"
                  asChild
                >
                  <Link to="/menu">Order Now</Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 h-auto"
                  asChild
                >
                  <Link to="/menu">View Menu</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-64 h-64 md:w-80 md:h-80 animate-float">
                <img 
                  src="/placeholder.svg" 
                  alt="Delicious Pizza" 
                  className="w-full h-full object-contain rounded-full pizza-shadow"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pizzas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-display">Our Popular Pizzas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPizzas.map(pizza => (
              <div key={pizza.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={pizza.image} 
                    alt={pizza.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{pizza.name}</h3>
                  <p className="text-gray-600 mb-4">{pizza.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-pizza-600">
                      From ${pizza.price.small.toFixed(2)}
                    </span>
                    <Button asChild>
                      <Link to={`/menu`}>Order Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button size="lg" asChild>
              <Link to="/menu">View Full Menu</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-display">Why Choose PizzaDelight?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-pizza-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pizza-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Customizable Pizzas</h3>
              <p className="text-gray-600">
                Create your perfect pizza with our wide selection of toppings and crusts.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-pizza-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pizza-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                We deliver hot, fresh pizzas to your doorstep in 30 minutes or less.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-pizza-100 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-pizza-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Ingredients</h3>
              <p className="text-gray-600">
                We use only the freshest, highest-quality ingredients in all our pizzas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-pizza-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-display">Ready to Order?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Satisfy your pizza cravings now. Order online and get a delicious, hot pizza delivered right to your door.
          </p>
          <Button 
            className="bg-white text-pizza-600 hover:bg-yellow-100 text-lg px-8 py-6 h-auto font-semibold"
            asChild
          >
            <Link to="/menu">Order Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
