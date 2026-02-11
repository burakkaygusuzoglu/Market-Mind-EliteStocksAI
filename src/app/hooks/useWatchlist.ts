'use client';

import { useState, useEffect } from 'react';

export function useWatchlist() {
    const [watchlist, setWatchlist] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('marketmind_watchlist');
        if (stored) {
            setWatchlist(JSON.parse(stored));
        } else {
            // Default stocks for new users
            setWatchlist(['AAPL', 'TSLA', 'MSFT', 'NVDA', 'AMZN']);
        }
        setIsLoaded(true);
    }, []);

    const addToWatchlist = (symbol: string) => {
        const upperSymbol = symbol.toUpperCase();
        if (!watchlist.includes(upperSymbol)) {
            const newWatchlist = [...watchlist, upperSymbol];
            setWatchlist(newWatchlist);
            localStorage.setItem('marketmind_watchlist', JSON.stringify(newWatchlist));
        }
    };

    const removeFromWatchlist = (symbol: string) => {
        const newWatchlist = watchlist.filter((s) => s !== symbol);
        setWatchlist(newWatchlist);
        localStorage.setItem('marketmind_watchlist', JSON.stringify(newWatchlist));
    };

    return { watchlist, addToWatchlist, removeFromWatchlist, isLoaded };
}
