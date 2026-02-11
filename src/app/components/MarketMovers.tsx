'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/app/lib/utils';
import clsx from 'clsx';
import { TrendingUp, Globe, Bitcoin, Layers } from 'lucide-react';
import Link from 'next/link';

// Asset Configuration
const ASSETS = {
    STOCKS: [
        { symbol: 'AMZN', name: 'Amazon' },
        { symbol: 'TSLA', name: 'Tesla' },
        { symbol: 'AAPL', name: 'Apple' },
        { symbol: 'NVDA', name: 'Nvidia' },
        { symbol: 'SOFI', name: 'SoFi' },
        { symbol: 'AMD', name: 'AMD' },
        { symbol: 'PYPL', name: 'PayPal' },
        { symbol: 'MSFT', name: 'Microsoft' },
        { symbol: 'META', name: 'Meta' },
        { symbol: 'GOOGL', name: 'Alphabet' },
    ],
    INDICES: [
        { symbol: 'SPY', name: 'S&P 500 (ETF)', original: 'SPX:IND' },
        { symbol: 'DIA', name: 'Dow Jones (ETF)', original: 'INDU:IND' },
        { symbol: 'QQQ', name: 'Nasdaq (ETF)', original: 'CCMP:IND' },
    ],
    CRYPTO: [
        { symbol: 'BINANCE:BTCUSDT', name: 'Bitcoin', display: 'BTC' },
        { symbol: 'BINANCE:ETHUSDT', name: 'Ethereum', display: 'ETH' },
        { symbol: 'BINANCE:LTCUSDT', name: 'Litecoin', display: 'LTC' },
        { symbol: 'BINANCE:BCHUSDT', name: 'Bitcoin Cash', display: 'BCH' },
    ]
};

type AssetCardProps = {
    symbol: string;
    name: string;
    displaySymbol?: string;
};

function AssetCard({ symbol, name, displaySymbol }: AssetCardProps) {

    const { data: quote } = useSWR(`/api/stocks/quote?symbol=${symbol}`, fetcher, {
        refreshInterval: 60000,
    });

    if (!quote || quote.c === undefined) return <div className="h-20 bg-white/5 animate-pulse rounded-lg" />;

    const price = quote.c || 0;
    const change = price - (quote.pc || 0);
    const percentChange = quote.pc ? (change / quote.pc) * 100 : 0;
    const isPositive = change >= 0;

    return (
        <Link href={`/${symbol}`} className="glass p-3 rounded-lg border border-white/5 hover:bg-white/10 transition-all group block">
            <div className="flex justify-between items-center mb-1">
                <div className="flex flex-col">
                    <span className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">{displaySymbol || symbol.split(':')[0]}</span>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider">{name}</span>
                </div>
                <div className={clsx("text-xs font-bold px-1.5 py-0.5 rounded", isPositive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400")}>
                    {percentChange.toFixed(2)}%
                </div>
            </div>
            <div className="text-right font-mono font-medium text-neutral-200 text-sm">
                ${price.toFixed(2)}
            </div>
        </Link>
    );
}

export default function MarketMovers() {
    const [activeTab, setActiveTab] = useState<'STOCKS' | 'INDICES' | 'CRYPTO'>('STOCKS');

    return (
        <div className="mb-10 animate-in slide-in-from-bottom-5 duration-700">
            <div className="flex items-center gap-6 mb-4 border-b border-white/5 pb-2">
                <h2 className="text-xl font-bold flex items-center gap-2 pr-4 border-r border-white/10">
                    <Layers className="w-5 h-5 text-blue-500" />
                    Market Data
                </h2>

                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('STOCKS')}
                        className={clsx("px-3 py-1 text-sm font-medium rounded-full transition-all flex items-center gap-2", activeTab === 'STOCKS' ? "bg-white text-black" : "text-neutral-400 hover:text-white")}
                    >
                        <TrendingUp className="w-4 h-4" /> Stocks
                    </button>
                    <button
                        onClick={() => setActiveTab('INDICES')}
                        className={clsx("px-3 py-1 text-sm font-medium rounded-full transition-all flex items-center gap-2", activeTab === 'INDICES' ? "bg-white text-black" : "text-neutral-400 hover:text-white")}
                    >
                        <Globe className="w-4 h-4" /> Indices
                    </button>
                    <button
                        onClick={() => setActiveTab('CRYPTO')}
                        className={clsx("px-3 py-1 text-sm font-medium rounded-full transition-all flex items-center gap-2", activeTab === 'CRYPTO' ? "bg-white text-black" : "text-neutral-400 hover:text-white")}
                    >
                        <Bitcoin className="w-4 h-4" /> Crypto
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {activeTab === 'STOCKS' && ASSETS.STOCKS.map(a => (
                    <AssetCard key={a.symbol} symbol={a.symbol} name={a.name} />
                ))}
                {activeTab === 'INDICES' && ASSETS.INDICES.map(a => (
                    <AssetCard key={a.symbol} symbol={a.symbol} name={a.name} />
                ))}
                {activeTab === 'CRYPTO' && ASSETS.CRYPTO.map(a => (
                    <AssetCard key={a.symbol} symbol={a.symbol} name={a.name} displaySymbol={a.display} />
                ))}
            </div>
        </div>
    );
}
