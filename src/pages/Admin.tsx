import { useMemo, useState } from 'react';
import { format, parseISO, startOfDay, subDays } from 'date-fns';
import { Info } from 'lucide-react';
import { toast } from 'sonner';

import OrderAnalytics from '@/components/OrderAnalytics';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useOrderStore } from '@/store/orderStore';
import useOrderAnalytics from '@/hooks/use-order-analytics';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { Order } from '@/types';

type OrderStatusFilter = 'all' | Order['status'];
type DateRangeFilter = 'all' | '7d' | '30d' | '90d';

const DATE_RANGE_DAYS: Record<Exclude<DateRangeFilter, 'all'>, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

const Admin = () => {
  const { getAllOrders, updateOrderStatus } = useOrderStore();

  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateRangeFilter>('all');

  const orders = getAllOrders();

  const filteredOrders = useMemo(() => {
    if (orders.length === 0) {
      return [] as Order[];
    }

    const now = new Date();
    const rangeStart =
      dateFilter === 'all'
        ? null
        : startOfDay(subDays(now, DATE_RANGE_DAYS[dateFilter] - 1));

    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      if (!matchesStatus) {
        return false;
      }

      if (!rangeStart) {
        return true;
      }

      const orderDate = parseISO(order.createdAt);
      if (Number.isNaN(orderDate.getTime())) {
        return false;
      }

      return orderDate >= rangeStart;
    });
  }, [orders, statusFilter, dateFilter]);

  const analytics = useOrderAnalytics(filteredOrders);

  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
    [],
  );

  const kpiCards = useMemo(() => {
    const statusCount = (status: Exclude<OrderStatusFilter, 'all'>) =>
      analytics.statusSummaries.find((summary) => summary.status === status)?.count ?? 0;

    const hasOrders = analytics.hasOrders;

    return [
      {
        key: 'total-orders',
        title: 'Total Orders',
        value: analytics.totalOrders.toLocaleString(),
        tooltip: 'Total number of orders returned by the current filters.',
        helper: hasOrders ? 'Includes every order across statuses.' : 'Waiting for your first order.',
      },
      {
        key: 'total-revenue',
        title: 'Total Revenue',
        value: currencyFormatter.format(analytics.totalRevenue),
        tooltip: 'Sum of order totals for the filtered selection.',
        helper: hasOrders
          ? 'Gross revenue before refunds or adjustments.'
          : 'Revenue appears after the first order.',
      },
      {
        key: 'revenue-week',
        title: 'Revenue (Last 7 Days)',
        value: currencyFormatter.format(analytics.revenueThisWeek),
        tooltip: 'Revenue generated during the past seven days within the filtered data.',
        helper: hasOrders
          ? 'Useful for spotting short-term momentum.'
          : 'No revenue recorded in the last week yet.',
      },
      {
        key: 'average-order-value',
        title: 'Average Order Value',
        value: hasOrders ? currencyFormatter.format(analytics.averageOrderValue) : '--',
        tooltip: 'Average amount spent per order in the current selection.',
        helper: hasOrders
          ? 'A higher value indicates larger baskets.'
          : 'Average order value will populate after orders arrive.',
      },
      {
        key: 'pending-orders',
        title: 'Pending Orders',
        value: statusCount('pending').toLocaleString(),
        tooltip: 'Orders awaiting confirmation or processing.',
        helper: hasOrders
          ? 'Follow up to keep customers informed.'
          : 'No pending orders at the moment.',
      },
      {
        key: 'completed-orders',
        title: 'Completed Orders',
        value: statusCount('completed').toLocaleString(),
        tooltip: 'Orders fulfilled and marked as completed.',
        helper: hasOrders
          ? 'Represents successful deliveries or pickups.'
          : 'Completed orders will appear once fulfilled.',
      },
    ];
  }, [analytics, currencyFormatter]);

  const handleStatusChange = (
    orderId: string,
    status: 'pending' | 'processing' | 'completed' | 'cancelled',
  ) => {
    updateOrderStatus(orderId, status);
    toast.success(`Order status updated to ${status}`);
  };

  const hasOrders = filteredOrders.length > 0;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="space-y-8">
        <div className="rounded-lg bg-white shadow-sm p-6 space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Sales Overview</h2>
              <p className="text-sm text-muted-foreground">
                Track performance and monitor order trends in real time.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase text-muted-foreground">Status</p>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatusFilter)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase text-muted-foreground">Date Range</p>
                <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as DateRangeFilter)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <TooltipProvider>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {kpiCards.map((card) => (
                <Card key={card.key}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className="rounded-full p-1 text-muted-foreground transition hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          aria-label={`More info about ${card.title}`}
                        >
                          <Info className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>{card.tooltip}</TooltipContent>
                    </Tooltip>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold tracking-tight">{card.value}</div>
                    <CardDescription className="mt-2">{card.helper}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TooltipProvider>
        </div>

        <OrderAnalytics metrics={analytics} />

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Order Management</h2>
            <p className="text-sm text-muted-foreground">
              Update statuses and review order details.
            </p>
          </div>

          {!hasOrders ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-sm text-muted-foreground">
              <p>
                {orders.length === 0
                  ? 'No orders to display yet.'
                  : 'No orders match the selected filters.'}
              </p>
              <p className="text-xs">
                {orders.length === 0
                  ? 'Orders will appear here once customers complete checkout.'
                  : 'Adjust the filters above to broaden your results.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Order ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Customer
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Delivery
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Payment
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Items
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.userId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            handleStatusChange(
                              order.id,
                              value as 'pending' | 'processing' | 'completed' | 'cancelled',
                            )
                          }
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <p className="font-medium text-gray-900">{order.contact.name || 'N/A'}</p>
                          <p>{order.contact.phone || 'N/A'}</p>
                          <p className="truncate max-w-[200px]" title={order.delivery.address}>
                            {order.delivery.address || 'N/A'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <p className="capitalize">{order.payment.method.replace('-', ' ')}</p>
                        <p className="capitalize text-gray-400">
                          {(order.payment.status ?? 'pending').replace('-', ' ')}
                        </p>
                        {order.delivery.instructions && (
                          <p
                            className="text-gray-400 text-xs truncate max-w-[200px]"
                            title={order.delivery.instructions}
                          >
                            Notes: {order.delivery.instructions}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.items.length} items
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
