
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { pizzas } from '@/data/pizzas';
import { drinks } from '@/data/drinks';
import { toppings } from '@/data/toppings';
import { toast } from 'sonner';

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateItemQuantity, clearCart, getTotalPrice } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const { placeOrder } = useOrderStore();

  const handlePlaceOrder = () => {
    if (!isAuthenticated) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const orderId = placeOrder(user!.id, items, getTotalPrice());
    clearCart();
    
    toast.success('Order placed successfully!');
    navigate('/orders');
  };

  const getPizzaById = (id: string) => pizzas.find(pizza => pizza.id === id);
  const getDrinkById = (id: string) => drinks.find(drink => drink.id === id);
  const getToppingById = (id: string) => toppings.find(topping => topping.id === id);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <p className="text-gray-600 mb-8">Your cart is empty</p>
        <Button onClick={() => navigate('/menu')}>Browse Menu</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-4">Order Items</h2>
            
            <div className="divide-y">
              {items.map(item => {
                if (item.type === 'pizza' && item.pizza) {
                  const pizza = getPizzaById(item.pizza.pizzaId);
                  if (!pizza) return null;
                  
                  return (
                    <div key={item.id} className="py-4 flex flex-col sm:flex-row">
                      <div className="sm:w-24 sm:h-24 mb-4 sm:mb-0">
                        <img
                          src={pizza.image}
                          alt={pizza.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 sm:pl-4">
                        <div className="flex justify-between mb-1">
                          <h3 className="font-medium">{pizza.name} ({item.pizza.size})</h3>
                          <span className="font-medium">
                            ${(pizza.price[item.pizza.size] * item.pizza.quantity).toFixed(2)}
                          </span>
                        </div>
                        
                        {item.pizza.toppings.length > 0 && (
                          <div className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Toppings: </span>
                            {item.pizza.toppings.map(toppingId => {
                              const topping = getToppingById(toppingId);
                              return topping ? (
                                <span key={toppingId} className="mr-1">
                                  {topping.name} (+${(topping.price[item.pizza!.size] * item.pizza!.quantity).toFixed(2)}),
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border rounded">
                            <Button
                              type="button"
                              variant="ghost"
                              className="px-2 h-8"
                              onClick={() => {
                                if (item.pizza!.quantity > 1) {
                                  updateItemQuantity(item.id, item.pizza!.quantity - 1);
                                } else {
                                  removeFromCart(item.id);
                                }
                              }}
                            >
                              -
                            </Button>
                            <span className="px-3">{item.pizza.quantity}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              className="px-2 h-8"
                              onClick={() => updateItemQuantity(item.id, item.pizza!.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                } else if (item.type === 'drink' && item.drink) {
                  const drink = getDrinkById(item.drink.drinkId);
                  if (!drink) return null;
                  
                  return (
                    <div key={item.id} className="py-4 flex flex-col sm:flex-row">
                      <div className="sm:w-24 sm:h-24 mb-4 sm:mb-0">
                        <img
                          src={drink.image}
                          alt={drink.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1 sm:pl-4">
                        <div className="flex justify-between mb-1">
                          <h3 className="font-medium">{drink.name} ({drink.size})</h3>
                          <span className="font-medium">
                            ${(drink.price * item.drink.quantity).toFixed(2)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border rounded">
                            <Button
                              type="button"
                              variant="ghost"
                              className="px-2 h-8"
                              onClick={() => {
                                if (item.drink!.quantity > 1) {
                                  updateItemQuantity(item.id, item.drink!.quantity - 1);
                                } else {
                                  removeFromCart(item.id);
                                }
                              }}
                            >
                              -
                            </Button>
                            <span className="px-3">{item.drink.quantity}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              className="px-2 h-8"
                              onClick={() => updateItemQuantity(item.id, item.drink!.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium text-lg pt-4 border-t">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <Button
                className="w-full bg-pizza-600 hover:bg-pizza-700"
                onClick={handlePlaceOrder}
              >
                Place Order
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/menu')}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
