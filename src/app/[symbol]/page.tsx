'use client';

import { use, useEffect, useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/app/lib/utils';
import StockChart from '@/app/components/StockChart';
import NewsFeed from '@/app/components/NewsFeed';
import AnalystRatings from '@/app/components/AnalystRatings';
import FinancialStats from '@/app/components/FinancialStats';
import CompanyProfile from '@/app/components/CompanyProfile';
import { ArrowUp, ArrowDown, Globe, Loader2, X } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';
import { useWatchlist } from '@/app/hooks/useWatchlist';
import { useRouter } from 'next/navigation';

export default function StockPage({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = use(params);
    const decodedSymbol = decodeURIComponent(symbol).toUpperCase();

    const { data: quote, error } = useSWR(`/api/stocks/quote?symbol=${decodedSymbol}`, fetcher, {
        refreshInterval: 10000,
    });
    const { data: profile } = useSWR(`/api/stocks/profile?symbol=${decodedSymbol}`, fetcher, {
        revalidateOnFocus: false,
    });

    const { addToWatchlist, removeFromWatchlist, watchlist } = useWatchlist();
    const isInWatchlist = watchlist.includes(decodedSymbol);
    const router = useRouter();

    const isLoading = !quote && !error;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        );
    }

    if (error || quote?.error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="p-4 rounded-full bg-red-500/10 text-red-400">
                    <X className="w-10 h-10" />
                </div>
                <h1 className="text-2xl font-bold">Stock Not Found</h1>
                <p className="text-neutral-400">Could not retrieve data for {decodedSymbol}.</p>
                <Link href="/" className="px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-colors">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    const price = quote?.c || 0;
    const change = quote ? (quote.c - quote.pc) : 0;
    const percentChange = quote?.pc ? (change / quote.pc) * 100 : 0;
    const isPositive = change >= 0;

    return (
        <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-white/5 pb-6">
                <div className="flex items-center gap-4">
                    {profile?.logo && (
                        <img src={profile.logo} alt={decodedSymbol} className="w-16 h-16 rounded-xl bg-white p-1 shadow-lg" />
                    )}
                    <div>
                        <h1 className="text-4xl font-bold tracking-tighter flex items-center gap-3">
                            {decodedSymbol}
                        </h1>
                        <div className="text-neutral-400 font-medium flex items-center gap-2">
                            {profile?.name}
                            {profile?.finnhubIndustry && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-neutral-600" />
                                    <span className="text-sm px-2 py-0.5 rounded-full bg-white/5 text-neutral-300 border border-white/5">
                                        {profile.finnhubIndustry}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-5xl font-bold tracking-tighter tabular-nums">
                            ${price.toFixed(2)}
                        </div>
                        <div className={clsx("text-lg font-medium flex items-center justify-end gap-1", isPositive ? "text-green-400" : "text-red-400")}>
                            {isPositive ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
                            {Math.abs(change).toFixed(2)} ({Math.abs(percentChange).toFixed(2)}%)
                        </div>
                    </div>

                    <button
                        onClick={() => isInWatchlist ? removeFromWatchlist(decodedSymbol) : addToWatchlist(decodedSymbol)}
                        className={clsx(
                            "px-4 py-2 rounded-lg font-bold text-sm transition-all border",
                            isInWatchlist
                                ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                                : "bg-blue-600 text-white border-blue-500 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                        )}
                    >
                        {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                <div className="lg:col-span-8 space-y-6">
                    {/* Chart Section */}
                    <div className="glass rounded-xl border-white/5 overflow-hidden">
                        <StockChart symbol={decodedSymbol} />
                        <div className="grid grid-cols-4 border-t border-white/5 divide-x divide-white/5 bg-neutral-900/50">
                            {[
                                { label: 'Open', val: quote.o },
                                { label: 'High', val: quote.h },
                                { label: 'Low', val: quote.l },
                                { label: 'Prev Close', val: quote.pc }
                            ].map(stat => (
                                <div key={stat.label} className="p-3 text-center">
                                    <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider mb-1">{stat.label}</div>
                                    <div className="text-sm font-mono font-medium">${stat.val.toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* News Section */}
                    <NewsFeed symbol={decodedSymbol} />
                </div>

                <div className="lg:col-span-4 space-y-6">
                    {/* Key Stats */}
                    <FinancialStats symbol={decodedSymbol} />

                    {/* Analyst Consensus */}
                    <AnalystRatings symbol={decodedSymbol} />

                    {/* Company Profile */}
                    <CompanyProfile symbol={decodedSymbol} />
                </div>
            </div>
        </div>
    );
}
