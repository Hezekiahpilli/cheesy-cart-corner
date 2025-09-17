import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCheckoutStore } from '@/store/checkoutStore';
import { useOrderStore } from '@/store/orderStore';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { pizzas } from '@/data/pizzas';
import { drinks } from '@/data/drinks';
import { toppings } from '@/data/toppings';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  phone: z
    .string()
    .min(7, 'Please enter a valid phone number')
    .max(20, 'Phone number is too long'),
  address: z.string().min(5, 'Please provide your delivery address'),
  instructions: z
    .string()
    .max(200, 'Delivery instructions must be 200 characters or fewer')
    .optional(),
  paymentMethod: z.enum(['cash', 'card']),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { snapshot, clearSnapshot } = useCheckoutStore();
  const { placeOrder } = useOrderStore();
  const { clearCart } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!snapshot || snapshot.items.length === 0) {
      toast.error('Your checkout session has expired. Please start again.');
      navigate('/cart', { replace: true });
    }
  }, [snapshot, navigate]);

  const defaultName = useMemo(() => {
    if (!user) return '';
    const parts = [user.firstName, user.lastName].filter(Boolean);
    return parts.join(' ');
  }, [user]);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: defaultName,
      phone: user?.phone ?? '',
      address: '',
      instructions: '',
      paymentMethod: 'cash',
    },
  });

  useEffect(() => {
    form.setValue('name', defaultName);
  }, [defaultName, form]);

  useEffect(() => {
    form.setValue('phone', user?.phone ?? '');
  }, [user, form]);

  const getPizzaById = (id: string) => pizzas.find(pizza => pizza.id === id);
  const getDrinkById = (id: string) => drinks.find(drink => drink.id === id);
  const getToppingById = (id: string) => toppings.find(topping => topping.id === id);

  const onSubmit = (values: CheckoutFormValues) => {
    if (!snapshot || !user) {
      toast.error('Unable to submit your order. Please try again.');
      return;
    }

    placeOrder({
      userId: user.id,
      items: snapshot.items,
      total: snapshot.total,
      contact: {
        name: values.name.trim(),
        phone: values.phone.trim(),
      },
      delivery: {
        address: values.address.trim(),
        instructions: values.instructions?.trim() ? values.instructions.trim() : undefined,
      },
      payment: {
        method: values.paymentMethod,
        status: 'pending',
      },
    });

    clearCart();
    clearSnapshot();
    toast.success('Order placed successfully!');
    navigate('/orders');
  };

  if (!snapshot || snapshot.items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="font-semibold text-xl mb-4">Delivery Details</h2>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="123 Pizza Street, Flavor Town"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instructions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Instructions (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ring the bell, call upon arrival, etc."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cash">Cash on Delivery</SelectItem>
                          <SelectItem value="card">Card on Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-pizza-600 hover:bg-pizza-700"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Placing Order...' : 'Place Order'}
                </Button>
              </form>
            </Form>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
            <h2 className="font-semibold text-xl mb-4">Order Summary</h2>
            <div className="space-y-4">
              {snapshot.items.map(item => {
                if (item.type === 'pizza' && item.pizza) {
                  const pizza = getPizzaById(item.pizza.pizzaId);
                  if (!pizza) return null;

                  return (
                    <div key={item.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <p className="font-medium">
                        {item.pizza.quantity} × {pizza.name} ({item.pizza.size})
                      </p>
                      {item.pizza.toppings.length > 0 && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Toppings:</span>{' '}
                          {item.pizza.toppings
                            .map(toppingId => getToppingById(toppingId)?.name)
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      )}
                    </div>
                  );
                }

                if (item.type === 'drink' && item.drink) {
                  const drink = getDrinkById(item.drink.drinkId);
                  if (!drink) return null;

                  return (
                    <div key={item.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <p className="font-medium">
                        {item.drink.quantity} × {drink.name} ({drink.size})
                      </p>
                    </div>
                  );
                }

                return null;
              })}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>${snapshot.total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Review your details before placing the order. You can always return to the cart if you need to make changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
