'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import useSWR from 'swr';
import { fetcher } from '@/app/lib/utils';
import { format } from 'date-fns';
import clsx from 'clsx';

type StockChartProps = {
    symbol: string;
};

export default function StockChart({ symbol }: StockChartProps) {
    // Fetch daily candles for the last year (D resolution)
    // We can default to 'D' for the main view
    const { data, error } = useSWR(`/api/stocks/candles?symbol=${symbol}&resolution=D`, fetcher, {
        revalidateOnFocus: false,
    });

    if (error || data?.error) return <div className="h-[400px] flex items-center justify-center text-red-400 bg-red-500/5 rounded-xl border border-red-500/10">Chart data unavailable</div>;

    // If no data is returned (e.g. invalid symbol or market holiday gaps in free tier)
    if (data?.s === 'no_data') return <div className="h-[400px] flex items-center justify-center text-neutral-500 bg-neutral-900/50 rounded-xl border border-white/5">No chart data available</div>;

    if (!data) return <div className="h-[400px] bg-neutral-900/50 animate-pulse rounded-xl border border-white/5" />;

    const chartData = data.t.map((timestamp: number, index: number) => ({
        time: timestamp * 1000, // Convert to ms
        price: data.c[index],
    }));

    // Determine trend for color
    const startPrice = chartData[0]?.price;
    const endPrice = chartData[chartData.length - 1]?.price;
    const isPositive = endPrice >= startPrice;
    const color = isPositive ? '#22c55e' : '#ef4444'; // green-500 : red-500

    return (
        <div className="w-full h-[400px] glass rounded-xl p-4 md:p-6 border-white/5">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full block"></span>
                Price Performance (1Y)
            </h3>
            <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', color: '#ededed' }}
                            itemStyle={{ color: '#ededed' }}
                            labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}
                            formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Price']}
                        />
                        <XAxis
                            dataKey="time"
                            tickFormatter={(tick) => format(new Date(tick), 'MMM')}
                            minTickGap={30}
                            tick={{ fill: '#525252', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            tickFormatter={(tick) => `$${tick}`}
                            tick={{ fill: '#525252', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            width={60}
                        />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke={color}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
