'use client';

import useSWR from 'swr';
import { ArrowUp, ArrowDown, X } from 'lucide-react';
import Link from 'next/link';
import { fetcher } from '@/app/lib/utils';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import SparklineChart from './SparklineChart';

type StockCardProps = {
    symbol: string;
    onRemove: (symbol: string) => void;
};

export default function StockCard({ symbol, onRemove }: StockCardProps) {
    const { data: quote, error } = useSWR(`/api/stocks/quote?symbol=${symbol}`, fetcher, {
        refreshInterval: 15000,
    });

    const { data: profile } = useSWR(`/api/stocks/profile?symbol=${symbol}`, fetcher, {
        revalidateOnFocus: false,
    });


    const { data: history } = useSWR(`/api/stocks/candles?symbol=${symbol}&resolution=60`, fetcher, {
        revalidateOnFocus: false,
    });

    const isLoading = !quote && !error;
    const isError = error || quote?.error;

    if (isLoading) {
        return (
            <div className="glass p-5 rounded-xl animate-pulse h-40 flex flex-col justify-between">
                <div className="flex justify-between">
                    <div className="w-16 h-6 bg-white/10 rounded"></div>
                    <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                </div>
                <div className="w-24 h-8 bg-white/10 rounded"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="glass p-5 rounded-xl border-red-500/20 flex flex-col justify-between h-40 relative group">
                <button
                    onClick={(e) => { e.preventDefault(); onRemove(symbol); }}
                    className="absolute top-2 right-2 p-1.5 text-neutral-500 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
                >
                    <X className="w-4 h-4" />
                </button>
                <div className="font-bold text-lg">{symbol}</div>
                <div className="text-sm text-red-400">Unavailable</div>
            </div>
        );
    }

    const price = quote?.c || 0;
    const prevClose = quote?.pc || 0;
    const change = price - prevClose;
    const percentChange = prevClose ? (change / prevClose) * 100 : 0;
    const isPositive = change >= 0;
    const color = isPositive ? '#4ade80' : '#f87171';

    const chartData = history?.c || [];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            layout
            className="relative group"
        >
            <Link href={`/${symbol}`} className="block">
                <div className="glass p-5 rounded-xl hover:bg-neutral-800/50 transition-all duration-300 border border-white/5 hover:border-white/10 h-40 flex flex-col justify-between relative overflow-hidden ring-1 ring-white/0 hover:ring-white/5 group-hover:shadow-2xl">
                    {/* Background Glow */}
                    <div className={clsx(
                        "absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br opacity-5 rounded-full blur-3xl transition-opacity duration-500",
                        isPositive ? "from-green-500 to-transparent" : "from-red-500 to-transparent"
                    )} />

                    <div className="flex justify-between items-start z-10">
                        <div className="flex items-center gap-3">
                            {profile?.logo && <img src={profile.logo} alt={symbol} className="w-8 h-8 rounded-full bg-white p-0.5" />}
                            <div>
                                <h3 className="font-bold text-lg tracking-tight">{symbol}</h3>
                                <p className="text-xs text-neutral-400 truncate max-w-[100px]">{profile?.name || 'Loading...'}</p>
                            </div>
                        </div>
                        <div className={clsx(
                            "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border",
                            isPositive
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : "bg-red-500/10 text-red-400 border-red-500/20"
                        )}>
                            {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                            {Math.abs(percentChange).toFixed(2)}%
                        </div>
                    </div>

                    <div className="z-10 flex items-end justify-between mt-4">
                        <div>
                            <div className="text-3xl font-bold tracking-tighter">
                                ${price.toFixed(2)}
                            </div>
                            <div className={clsx(
                                "text-sm font-medium mt-1 flex items-center gap-1",
                                isPositive ? "text-green-400" : "text-red-400"
                            )}>
                                {isPositive ? '+' : ''}{change.toFixed(2)}
                                <span className="text-neutral-500 font-normal">Today</span>
                            </div>
                        </div>

                        {/* Mini Chart */}
                        <div className="opacity-50 group-hover:opacity-100 transition-opacity">
                            <SparklineChart data={chartData} color={color} />
                        </div>
                    </div>
                </div>
            </Link>
            <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(symbol); }}
                className="absolute top-3 right-3 p-1.5 text-neutral-500 hover:text-white hover:bg-black/50 rounded-full transition-colors opacity-0 group-hover:opacity-100 z-20"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}
