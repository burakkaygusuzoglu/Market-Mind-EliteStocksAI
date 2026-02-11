'use client';

import useSWR from 'swr';
import { fetcher } from '@/app/lib/utils';
import clsx from 'clsx';

type AnalystRatingsProps = {
    symbol: string;
};

export default function AnalystRatings({ symbol }: AnalystRatingsProps) {
    const { data: recommendations, error } = useSWR(`/api/stocks/recommendation?symbol=${symbol}`, fetcher, {
        revalidateOnFocus: false,
    });

    if (error) return null;
    if (!recommendations || recommendations.length === 0) return null;

    // Get the latest recommendation
    const latest = recommendations[0];
    const total = latest.buy + latest.hold + latest.sell + latest.strongBuy + latest.strongSell;

    if (total === 0) return (
        <div className="glass rounded-xl p-6 border-white/5">
            <h3 className="text-lg font-bold mb-4">Analyst Consensus</h3>
            <p className="text-neutral-500">No analyst data available.</p>
        </div>
    );

    const buyPercent = ((latest.buy + latest.strongBuy) / total) * 100;
    const holdPercent = (latest.hold / total) * 100;
    const sellPercent = ((latest.sell + latest.strongSell) / total) * 100;

    return (
        <div className="glass rounded-xl p-6 border-white/5">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full block"></span>
                Analyst Consensus
            </h3>

            <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{latest.buy + latest.strongBuy}</div>
                    <div className="text-xs text-neutral-400 uppercase tracking-wider">Buy</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{latest.hold}</div>
                    <div className="text-xs text-neutral-400 uppercase tracking-wider">Hold</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{latest.sell + latest.strongSell}</div>
                    <div className="text-xs text-neutral-400 uppercase tracking-wider">Sell</div>
                </div>
            </div>

            <div className="h-4 w-full bg-neutral-800 rounded-full overflow-hidden flex">
                <div style={{ width: `${buyPercent}%` }} className="h-full bg-green-500" title={`Buy: ${buyPercent.toFixed(1)}%`} />
                <div style={{ width: `${holdPercent}%` }} className="h-full bg-yellow-500" title={`Hold: ${holdPercent.toFixed(1)}%`} />
                <div style={{ width: `${sellPercent}%` }} className="h-full bg-red-500" title={`Sell: ${sellPercent.toFixed(1)}%`} />
            </div>

            <div className="mt-4 text-center text-sm text-neutral-400">
                Based on {total} analyst ratings
            </div>
        </div>
    );
}
