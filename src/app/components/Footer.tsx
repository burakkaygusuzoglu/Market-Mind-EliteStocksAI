export default function Footer() {
    return (
        <footer className="border-t border-white/5 mt-12 py-8 text-center text-xs text-neutral-500">
            <p className="mb-2">Data provided by Finnhub. Market data delayed by at least 15 minutes.</p>
            <p>&copy; {new Date().getFullYear()} MarketMind. All rights reserved.</p>
        </footer>
    );
}
