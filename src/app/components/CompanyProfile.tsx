'use client';

import useSWR from 'swr';
import { fetcher } from '@/app/lib/utils';
import { Building2, Phone, Globe, DollarSign, Users } from 'lucide-react';

type CompanyProfileProps = {
    symbol: string;
};

export default function CompanyProfile({ symbol }: CompanyProfileProps) {
    const { data: profile } = useSWR(`/api/stocks/profile?symbol=${symbol}`, fetcher, {
        revalidateOnFocus: false,
    });

    if (!profile) return null;

    return (
        <div className="glass rounded-xl p-6 border-white/5 space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-500" />
                Company Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-xs text-neutral-400 mb-1">Market Cap</div>
                    <div className="font-semibold text-sm">
                        {profile.marketCapitalization ? `$${(profile.marketCapitalization / 1000).toFixed(2)}B` : 'N/A'}
                    </div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-xs text-neutral-400 mb-1">Shares Outstanding</div>
                    <div className="font-semibold text-sm">
                        {profile.shareOutstanding ? `${profile.shareOutstanding.toFixed(2)}M` : 'N/A'}
                    </div>
                </div>
                <div className="p-3 bg-white/5 rounded-lg col-span-2">
                    <div className="text-xs text-neutral-400 mb-1">Industry</div>
                    <div className="font-semibold text-sm">{profile.finnhubIndustry || 'N/A'}</div>
                </div>
            </div>

            <div className="space-y-2 text-sm text-neutral-300 pt-2 border-t border-white/5">
                {profile.phone && (
                    <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-neutral-500" />
                        <span>{profile.phone}</span>
                    </div>
                )}
                {profile.weburl && (
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-neutral-500" />
                        <a href={profile.weburl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate">
                            {profile.weburl}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
