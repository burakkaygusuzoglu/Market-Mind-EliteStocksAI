'use client';

import useSWR from 'swr';
import { fetcher } from '@/app/lib/utils';
import { ExternalLink, Calendar, Newspaper } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

type NewsFeedProps = {
    symbol: string;
};

export default function NewsFeed({ symbol }: NewsFeedProps) {
    const { data: news, error } = useSWR(`/api/stocks/news?symbol=${symbol}`, fetcher, {
        revalidateOnFocus: false,
    });

    const isLoading = !news && !error;

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-48 glass animate-pulse rounded-xl border-white/5" />
                ))}
            </div>
        );
    }

    if (!news || news.length === 0) return (
        <div className="glass p-8 text-center rounded-xl border-white/5 text-neutral-500">
            <Newspaper className="w-10 h-10 mx-auto mb-3 opacity-50" />
            No recent news available for this stock.
        </div>
    );

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-pink-500" />
                Latest News
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {news.slice(0, 6).map((item: any, i: number) => (
                    <a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group glass p-0 rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all hover:scale-[1.02] flex flex-col h-full"
                    >
                        {item.image && (
                            <div className="h-32 w-full overflow-hidden relative">
                                <img
                                    src={item.image}
                                    alt={item.headline}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                <div className="absolute bottom-2 left-3 text-xs font-bold text-white bg-blue-600/80 px-2 py-0.5 rounded backdrop-blur-sm">
                                    {item.source}
                                </div>
                            </div>
                        )}

                        <div className="p-4 flex flex-col justify-between flex-1">
                            <div>
                                <h4 className="font-bold text-sm leading-snug text-neutral-200 group-hover:text-white transition-colors line-clamp-2 mb-2">
                                    {item.headline}
                                </h4>
                                <p className="text-xs text-neutral-400 line-clamp-3 mb-3">
                                    {item.summary}
                                </p>
                            </div>

                            <div className="flex items-center justify-between text-xs text-neutral-500 mt-auto pt-3 border-t border-white/5">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDistanceToNow(item.datetime * 1000)} ago
                                </div>
                                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
