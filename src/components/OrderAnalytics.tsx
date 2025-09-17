import { useMemo } from 'react';
import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, XAxis, YAxis } from 'recharts';

import type { OrderAnalyticsMetrics } from '@/hooks/use-order-analytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  completed: '#22c55e',
  cancelled: '#ef4444',
};

type OrderAnalyticsProps = {
  metrics: OrderAnalyticsMetrics;
};

const OrderAnalytics = ({ metrics }: OrderAnalyticsProps) => {
  const revenueConfig = useMemo<ChartConfig>(
    () => ({
      revenue: {
        label: 'Revenue',
        color: 'hsl(var(--primary))',
      },
    }),
    [],
  );

  const statusConfig = useMemo<ChartConfig>(() => {
    const entries = metrics.statusSummaries.map((summary) => [
      summary.status,
      {
        label: summary.label,
        color: STATUS_COLORS[summary.status] ?? 'hsl(var(--muted-foreground))',
      },
    ] as const);
    return Object.fromEntries(entries);
  }, [metrics.statusSummaries]);

  const hasRevenueData = metrics.dailyRevenue.length > 0;
  const hasStatusData = metrics.statusSummaries.some((summary) => summary.count > 0);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Revenue Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {hasRevenueData ? (
            <ChartContainer config={revenueConfig} className="h-[260px]">
              <LineChart data={metrics.dailyRevenue} margin={{ left: 12, right: 12, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} interval="preserveStartEnd" />
                <YAxis tickLine={false} axisLine={false} width={80} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value) => `Revenue: $${Number(value).toFixed(2)}`}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[260px] flex-col items-center justify-center text-center text-sm text-muted-foreground">
              <p>No revenue data for the selected range.</p>
              <p className="mt-1">Orders will appear here once they start coming in.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Order Status Mix</CardTitle>
        </CardHeader>
        <CardContent>
          {hasStatusData ? (
            <ChartContainer config={statusConfig} className="h-[260px]">
              <PieChart>
                <Pie data={metrics.statusSummaries} dataKey="count" nameKey="label" innerRadius={60} outerRadius={90}>
                  {metrics.statusSummaries.map((summary) => (
                    <Cell key={summary.status} fill={STATUS_COLORS[summary.status] ?? '#a1a1aa'} />
                  ))}
                </Pie>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => `${name}: ${value}`}
                      labelFormatter={() => 'Order Status'}
                    />
                  }
                />
                <ChartLegend
                  content={<ChartLegendContent className="flex flex-wrap justify-center gap-4 text-xs" />}
                />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="flex h-[260px] flex-col items-center justify-center text-center text-sm text-muted-foreground">
              <p>No orders to visualize yet.</p>
              <p className="mt-1">Place or import orders to see the status distribution.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderAnalytics;
