'use client';

import { useState } from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';
// Client-side component


type StockSearchProps = {
    onAdd: (symbol: string) => void;
};

export default function StockSearch({ onAdd }: StockSearchProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;

        setIsLoading(true);
        try {
            const res = await fetch(`/api/stocks/search?q=${query}`);
            const data = await res.json();
            if (data.result) {
                setResults(data.result);
                setShowResults(true);
            }
        } catch (error) {
            console.error('Search failed', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-full max-w-md mx-auto mb-8">
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search symbol (e.g. AAPL)..."
                    className="w-full bg-neutral-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-lg placeholder:text-neutral-500"
                />
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-neutral-500" />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="absolute right-2 top-2 p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-neutral-400 hover:text-white"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                </button>
            </form>

            {showResults && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                    {results.map((stock) => (
                        <button
                            key={stock.symbol}
                            onClick={() => {
                                onAdd(stock.symbol);
                                setQuery('');
                                setShowResults(false);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex justify-between items-center group border-b border-white/5 last:border-0"
                        >
                            <div>
                                <span className="font-bold text-white block">{stock.symbol}</span>
                                <span className="text-xs text-neutral-400 block truncate max-w-[200px]">{stock.description}</span>
                            </div>
                            <Plus className="w-4 h-4 text-neutral-500 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
