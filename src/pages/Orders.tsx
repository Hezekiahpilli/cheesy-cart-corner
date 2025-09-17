
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { pizzas } from '@/data/pizzas';
import { drinks } from '@/data/drinks';
import { toppings } from '@/data/toppings';
import { format } from 'date-fns';

const OrderStatus = ({ status }: { status: string }) => {
  let bgColor = '';
  let textColor = '';

  switch (status) {
    case 'pending':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      break;
    case 'processing':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'completed':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'cancelled':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
  }

  return (
    <span className={`${bgColor} ${textColor} px-2 py-1 rounded-full text-xs font-medium capitalize`}>
      {status}
    </span>
  );
};

const Orders = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuthStore();
  const { getUserOrders, getAllOrders } = useOrderStore();

  const orders = isAdmin ? getAllOrders() : getUserOrders(user?.id || '');

  const getPizzaById = (id: string) => pizzas.find(pizza => pizza.id === id);
  const getDrinkById = (id: string) => drinks.find(drink => drink.id === id);
  const getToppingById = (id: string) => toppings.find(topping => topping.id === id);

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">{isAdmin ? 'All Orders' : 'Your Orders'}</h1>
        <p className="text-gray-600 mb-8">No orders found</p>
        {!isAdmin && (
          <button
            className="bg-pizza-600 text-white px-4 py-2 rounded hover:bg-pizza-700"
            onClick={() => navigate('/menu')}
          >
            Browse Menu
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{isAdmin ? 'All Orders' : 'Your Orders'}</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-wrap justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">
                  Order #<span className="font-mono">{order.id.slice(0, 8)}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Placed on {format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}
                </p>
                {isAdmin && (
                  <p className="text-sm text-gray-500 mt-1">
                    Customer ID: {order.userId}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <OrderStatus status={order.status} />
                <span className="font-semibold">${order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item) => {
                  if (item.type === 'pizza' && item.pizza) {
                    const pizza = getPizzaById(item.pizza.pizzaId);
                    if (!pizza) return null;

                    return (
                      <div key={item.id} className="flex items-start">
                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden mr-3 flex-shrink-0">
                          <img
                            src={pizza.image}
                            alt={pizza.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">
                            {item.pizza.quantity} × {pizza.name} ({item.pizza.size})
                          </p>
                          {item.pizza.toppings.length > 0 && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Toppings:</span>{' '}
                              {item.pizza.toppings
                                .map((toppingId) => {
                                  const topping = getToppingById(toppingId);
                                  return topping ? topping.name : '';
                                })
                                .filter(Boolean)
                                .join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  } else if (item.type === 'drink' && item.drink) {
                    const drink = getDrinkById(item.drink.drinkId);
                    if (!drink) return null;

                    return (
                      <div key={item.id} className="flex items-start">
                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden mr-3 flex-shrink-0">
                          <img
                            src={drink.image}
                            alt={drink.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">
                            {item.drink.quantity} × {drink.name} ({drink.size})
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
