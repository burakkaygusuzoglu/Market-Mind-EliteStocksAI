'use client';

import useSWR from 'swr';
import { fetcher } from '@/app/lib/utils';
import { TrendingUp, Activity, DollarSign, BarChart3, Scale, Clock } from 'lucide-react';
import clsx from 'clsx';

type FinancialStatsProps = {
    symbol: string;
};

export default function FinancialStats({ symbol }: FinancialStatsProps) {
    const { data: metrics, error } = useSWR(`/api/stocks/metric?symbol=${symbol}`, fetcher, {
        revalidateOnFocus: false,
    });

    if (!metrics || !metrics.metric) return null;
    const m = metrics.metric;

    const stats = [
        {
            label: '52 Week High',
            value: m['52WeekHigh'] ? `$${m['52WeekHigh'].toFixed(2)}` : 'N/A',
            icon: TrendingUp,
            color: 'text-green-400'
        },
        {
            label: '52 Week Low',
            value: m['52WeekLow'] ? `$${m['52WeekLow'].toFixed(2)}` : 'N/A',
            icon: TrendingUp,
            color: 'text-red-400',
            rotate: true
        },
        {
            label: 'Market Cap',
            value: m['marketCapitalization'] ? `$${(m['marketCapitalization'] / 1000).toFixed(2)}B` : 'N/A',
            icon: DollarSign,
            color: 'text-blue-400'
        },
        {
            label: 'P/E Ratio (TTM)',
            value: m['peBasicExclExtraTTM'] ? m['peBasicExclExtraTTM'].toFixed(2) : 'N/A',
            icon: Scale,
            color: 'text-purple-400'
        },
        {
            label: 'Beta',
            value: m['beta'] ? m['beta'].toFixed(2) : 'N/A',
            icon: Activity,
            color: 'text-orange-400'
        },
        {
            label: 'EPS (TTM)',
            value: m['epsBasicExclExtraItemsTTM'] ? `$${m['epsBasicExclExtraItemsTTM'].toFixed(2)}` : 'N/A',
            icon: BarChart3,
            color: 'text-cyan-400'
        },
    ];

    return (
        <div className="glass rounded-xl p-6 border-white/5">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-500" />
                Key Statistics
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors group">
                        <div className="flex items-center gap-2 mb-2">
                            <div className={clsx("p-1.5 rounded-lg bg-white/5", stat.color)}>
                                <stat.icon className={clsx("w-4 h-4", stat.rotate && "rotate-180")} />
                            </div>
                            <span className="text-xs font-medium text-neutral-400">{stat.label}</span>
                        </div>
                        <div className="text-lg font-bold tracking-tight text-white group-hover:text-blue-100 transition-colors">
                            {stat.value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
