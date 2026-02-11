'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Clock } from 'lucide-react';
import clsx from 'clsx';

export default function MarketStatus() {
    const [isOpen, setIsOpen] = useState(false);
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const checkMarketStatus = () => {
            const now = new Date();

            // Convert to EST (New York time)
            const estTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
            const day = estTime.getDay();
            const hour = estTime.getHours();
            const minute = estTime.getMinutes();
            const totalMinutes = hour * 60 + minute;

            // Market Hours: 9:30 AM (570 min) to 4:00 PM (960 min), Mon-Fri
            const isWeekday = day >= 1 && day <= 5;
            const isMarketTime = totalMinutes >= 570 && totalMinutes < 960;

            setIsOpen(isWeekday && isMarketTime);
        };

        // Check connectivity
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        checkMarketStatus();
        const interval = setInterval(checkMarketStatus, 60000); // Check every minute

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end pointer-events-none">
            <div className={clsx(
                "px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold backdrop-blur-md shadow-lg border transition-all duration-500",
                isOpen
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : "bg-neutral-900/80 text-neutral-400 border-white/5"
            )}>
                <span className={clsx("w-2 h-2 rounded-full", isOpen ? "bg-green-500 animate-pulse" : "bg-neutral-500")} />
                {isOpen ? 'MARKET OPEN' : 'MARKET CLOSED'}
            </div>

            {!isOnline && (
                <div className="px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 backdrop-blur-md shadow-lg">
                    <WifiOff className="w-3 h-3" />
                    OFFLINE
                </div>
            )}
        </div>
    );
}
