import { useMemo } from 'react';
import { format, parseISO, startOfDay, subDays } from 'date-fns';

import type { Order } from '@/types';

type OrderStatus = Order['status'];

type DailyRevenuePoint = {
  date: string;
  label: string;
  revenue: number;
  orderCount: number;
};

type StatusSummary = {
  status: OrderStatus;
  label: string;
  count: number;
};

export type OrderAnalyticsMetrics = {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  revenueThisWeek: number;
  statusSummaries: StatusSummary[];
  dailyRevenue: DailyRevenuePoint[];
  hasOrders: boolean;
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const useOrderAnalytics = (orders: Order[]): OrderAnalyticsMetrics => {
  return useMemo(() => {
    if (orders.length === 0) {
      return {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        revenueThisWeek: 0,
        statusSummaries: (Object.keys(STATUS_LABELS) as OrderStatus[]).map((status) => ({
          status,
          label: STATUS_LABELS[status],
          count: 0,
        })),
        dailyRevenue: [],
        hasOrders: false,
      };
    }

    const now = new Date();
    const weekStart = startOfDay(subDays(now, 6));

    let totalRevenue = 0;
    const statusCounts: Record<OrderStatus, number> = {
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
    };

    const revenueByDay = new Map<string, { revenue: number; orderCount: number; date: Date }>();
    let revenueThisWeek = 0;

    orders.forEach((order) => {
      const orderDate = parseISO(order.createdAt);
      if (Number.isNaN(orderDate.getTime())) {
        return;
      }

      totalRevenue += order.total;
      statusCounts[order.status] += 1;

      const dayKey = format(orderDate, 'yyyy-MM-dd');
      const existing = revenueByDay.get(dayKey);
      if (existing) {
        existing.revenue += order.total;
        existing.orderCount += 1;
      } else {
        revenueByDay.set(dayKey, {
          revenue: order.total,
          orderCount: 1,
          date: orderDate,
        });
      }

      if (orderDate >= weekStart) {
        revenueThisWeek += order.total;
      }
    });

    const totalOrders = orders.length;
    const averageOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

    const dailyRevenue: DailyRevenuePoint[] = Array.from(revenueByDay.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(({ date, revenue, orderCount }) => ({
        date: format(date, 'yyyy-MM-dd'),
        label: format(date, 'MMM d'),
        revenue,
        orderCount,
      }));

    const statusSummaries: StatusSummary[] = (Object.keys(STATUS_LABELS) as OrderStatus[]).map((status) => ({
      status,
      label: STATUS_LABELS[status],
      count: statusCounts[status],
    }));

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      revenueThisWeek,
      statusSummaries,
      dailyRevenue,
      hasOrders: totalOrders > 0,
    };
  }, [orders]);
};

export default useOrderAnalytics;
