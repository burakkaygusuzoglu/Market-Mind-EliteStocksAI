'use client';

import useSWR from 'swr';
import { fetcher } from '@/app/lib/utils';
import clsx from 'clsx';
import { ArrowUp, ArrowDown } from 'lucide-react';

type MarketIndexProps = {
    symbol: string;
    name: string;
};

export default function MarketIndex({ symbol, name }: MarketIndexProps) {
    const { data: quote, error } = useSWR(`/api/stocks/quote?symbol=${symbol}`, fetcher, {
        refreshInterval: 30000,
    });

    const isLoading = !quote && !error;

    if (isLoading) return <div className="h-24 bg-neutral-900/50 animate-pulse rounded-xl border border-white/5" />;
    if (error || quote?.error) return <div className="h-24 bg-red-500/5 rounded-xl border border-red-500/10 flex items-center justify-center text-red-400">Unavailable</div>;

    const change = quote.c - quote.pc;
    const percentChange = (change / quote.pc) * 100;
    const isPositive = change >= 0;

    return (
        <div className="glass p-5 rounded-xl border-white/5 flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <div className="font-bold text-lg">{name}</div>
                    <div className="text-xs text-neutral-400">{symbol}</div>
                </div>
                <div className={clsx(
                    "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg",
                    isPositive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                )}>
                    {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {Math.abs(percentChange).toFixed(2)}%
                </div>
            </div>

            <div className="mt-2">
                <div className="text-2xl font-bold tracking-tight">${quote.c.toFixed(2)}</div>
                <div className={clsx("text-sm", isPositive ? "text-green-400" : "text-red-400")}>
                    {isPositive ? '+' : ''}{change.toFixed(2)}
                </div>
            </div>
        </div>
    );
}
