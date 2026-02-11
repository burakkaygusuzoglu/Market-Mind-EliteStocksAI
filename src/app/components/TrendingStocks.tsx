'use client';

import Link from 'next/link';
import { TrendingUp, ArrowRight } from 'lucide-react';
import useSWR from 'swr';
import { fetcher } from '@/app/lib/utils';
import clsx from 'clsx';

const POPULAR_STOCKS = ['NVDA', 'TSM', 'AMD', 'META', 'NFLX', 'PLTR'];

export default function TrendingStocks() {
    return (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    Market Movers
                </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {POPULAR_STOCKS.map(symbol => (
                    <TrendingStockCard key={symbol} symbol={symbol} />
                ))}
            </div>
        </div>
    );
}

function TrendingStockCard({ symbol }: { symbol: string }) {
    const { data: quote } = useSWR(`/api/stocks/quote?symbol=${symbol}`, fetcher, {
        refreshInterval: 60000,
    });

    // We can't fetch profile for all in list efficiently without batching, 
    // so we'll stick to price/change for this lightweight view or mock name if needed.

    if (!quote) return <div className="h-24 bg-white/5 animate-pulse rounded-xl" />;

    const change = quote.c - quote.pc;
    const percentChange = (change / quote.pc) * 100;
    const isPositive = change >= 0;

    return (
        <Link href={`/${symbol}`} className="glass p-4 rounded-xl border-white/5 hover:bg-white/10 transition-all group block">
            <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-lg group-hover:text-blue-400 transition-colors">{symbol}</span>
                <span className={clsx("text-xs font-bold px-1.5 py-0.5 rounded", isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
                    {isPositive ? '+' : ''}{percentChange.toFixed(2)}%
                </span>
            </div>
            <div className="text-sm font-medium text-neutral-300">
                ${quote.c.toFixed(2)}
            </div>
        </Link>
    );
}
