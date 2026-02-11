'use client';

import { X, Trash2, Zap, Monitor, Globe } from 'lucide-react';
import { useWatchlist } from '@/app/hooks/useWatchlist';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

type SettingsModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { watchlist, removeFromWatchlist } = useWatchlist();
    const [highPerformance, setHighPerformance] = useState(true);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleClearWatchlist = () => {
        if (confirm('Are you sure you want to clear your entire watchlist?')) {
            watchlist.forEach(s => removeFromWatchlist(s));
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-bold">App Settings</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-neutral-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Preferences</h3>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-medium">Real-time Animations</div>
                                    <div className="text-xs text-neutral-500">Flash colors on price updates</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setHighPerformance(!highPerformance)}
                                className={clsx(
                                    "w-12 h-6 rounded-full transition-colors relative",
                                    highPerformance ? "bg-blue-600" : "bg-neutral-800"
                                )}
                            >
                                <div className={clsx(
                                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md",
                                    highPerformance ? "left-7" : "left-1"
                                )} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                                    <Monitor className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-medium">Theme</div>
                                    <div className="text-xs text-neutral-500">Dark Mode (Default)</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">Data Management</h3>

                        <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Trash2 className="w-5 h-5 text-red-400" />
                                <span className="text-sm font-medium text-red-200">Clear Watchlist</span>
                            </div>
                            <button
                                onClick={handleClearWatchlist}
                                className="px-3 py-1.5 text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-colors"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>

                    <div className="text-center pt-4 border-t border-white/5">
                        <p className="text-xs text-neutral-600">MarketMind Pro v1.2.0 • Build 2026.02.12</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
