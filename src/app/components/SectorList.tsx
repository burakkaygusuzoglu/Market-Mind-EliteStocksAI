'use client';

import useSWR from 'swr';
import { fetcher } from '@/app/lib/utils';
import Link from 'next/link';
import clsx from 'clsx';
import { ArrowUp, ArrowDown } from 'lucide-react';

type SectorItemProps = {
    symbol: string;
};

function SectorItem({ symbol }: SectorItemProps) {
    const { data: quote } = useSWR(`/api/stocks/quote?symbol=${symbol}`, fetcher, {
        refreshInterval: 60000, // slower poll for lists
    });
    const { data: profile } = useSWR(`/api/stocks/profile?symbol=${symbol}`, fetcher, {
        revalidateOnFocus: false,
    });

    if (!quote || quote.c === undefined) return <div className="h-14 bg-neutral-900/30 animate-pulse rounded-lg bg-white/5" />;

    const change = (quote.c || 0) - (quote.pc || 0);
    const percentChange = quote.pc ? (change / quote.pc) * 100 : 0;
    const isPositive = change >= 0;

    return (
        <Link href={`/${symbol}`} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors group">
            <div className="flex items-center gap-3">
                <div className={clsx("w-1 h-8 rounded-full", isPositive ? "bg-green-500" : "bg-red-500")} />
                <div>
                    <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{symbol}</div>
                    <div className="text-xs text-neutral-400 truncate max-w-[120px]">{profile?.name || symbol}</div>
                </div>
            </div>

            <div className="text-right">
                <div className="font-medium">${(quote.c || 0).toFixed(2)}</div>
                <div className={clsx("text-xs flex items-center justify-end gap-0.5", isPositive ? "text-green-400" : "text-red-400")}>
                    {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {Math.abs(percentChange).toFixed(2)}%
                </div>
            </div>
        </Link>
    );
}

type SectorListProps = {
    title: string;
    symbols: string[];
};

export default function SectorList({ title, symbols }: SectorListProps) {
    return (
        <div className="glass rounded-xl p-5 border-white/5">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full block"></span>
                {title}
            </h3>
            <div className="space-y-1">
                {symbols.map(sym => (
                    <SectorItem key={sym} symbol={sym} />
                ))}
            </div>
        </div>
    );
}
