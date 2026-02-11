'use client';

import { useWatchlist } from '@/app/hooks/useWatchlist';
import StockSearch from './components/StockSearch';
import StockCard from './components/StockCard';
import MarketMovers from './components/MarketMovers';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
    const { watchlist, addToWatchlist, removeFromWatchlist, isLoaded } = useWatchlist();

    if (!isLoaded) return null;

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4 py-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-500">
                    MarketMind
                </h1>
                <p className="text-neutral-400 max-w-lg mx-auto">
                    Professional grade market intelligence.
                </p>
            </div>

            <div className="mb-8">
                <StockSearch onAdd={addToWatchlist} />
            </div>

            <MarketMovers />

            <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-500 rounded-full block"></span>
                    My Watchlist
                </h2>

                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    <AnimatePresence>
                        {watchlist.map((symbol) => (
                            <StockCard
                                key={symbol}
                                symbol={symbol}
                                onRemove={removeFromWatchlist}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {watchlist.length === 0 && (
                    <div className="text-center py-20 text-neutral-600 border border-white/5 rounded-xl bg-white/5">
                        <p>Your watchlist is empty. Search for a stock above to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
