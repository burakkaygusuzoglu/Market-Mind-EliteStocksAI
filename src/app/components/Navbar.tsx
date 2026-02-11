'use client';

import Link from 'next/link';
import { Search, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import SettingsModal from './SettingsModal';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // Add scroll listener effect here if needed for dynamic styling

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 h-16 flex items-center px-4 md:px-8">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-colors">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white">Market<span className="text-blue-500">Mind</span></span>
                </Link>

                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
                    <Link href="/" className="hover:text-white transition-colors">Dashboard</Link>
                    <Link href="/market" className="hover:text-white transition-colors">Market</Link>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-neutral-400 hover:text-white">
                        <Search className="w-5 h-5" />
                    </button>

                    <button onClick={() => setShowSettings(true)} className="group relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 ring-2 ring-white/10 group-hover:ring-white/30 transition-all"></div>
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0a0a0a] rounded-full"></div>
                    </button>
                </div>
            </div>
            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
        </nav>
    );
}
