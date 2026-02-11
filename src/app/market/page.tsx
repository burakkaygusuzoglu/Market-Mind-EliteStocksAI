import MarketIndex from '@/app/components/MarketIndex';
import SectorList from '@/app/components/SectorList';

export default function MarketPage() {
    return (
        <div className="space-y-8 pb-10">
            <div className="text-center space-y-4 py-6">
                <h1 className="text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-500">
                    Global Markets
                </h1>
                <p className="text-neutral-400 max-w-lg mx-auto">
                    Overview of major indices and sector performance.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MarketIndex symbol="SPY" name="S&P 500" />
                <MarketIndex symbol="QQQ" name="Nasdaq-100" />
                <MarketIndex symbol="DIA" name="Dow Jones" />
                <MarketIndex symbol="IWM" name="Russell 2000" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SectorList
                    title="Big Tech"
                    symbols={['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NFLX']}
                />
                <SectorList
                    title="Semiconductors"
                    symbols={['NVDA', 'AMD', 'AVGO', 'INTC', 'TSM', 'MU', 'QCOM']}
                />
                <SectorList
                    title="Finance"
                    symbols={['JPM', 'BAC', 'V', 'MA', 'GS', 'MS', 'WFC']}
                />
                <SectorList
                    title="EV & Auto"
                    symbols={['TSLA', 'F', 'GM', 'RIVN', 'LCID', 'TM', 'HMC']}
                />
                <SectorList
                    title="Cloud & SaaS"
                    symbols={['CRM', 'ADBE', 'NOW', 'SNOW', 'DDOG', 'PLTR', 'SHOP']}
                />
                <SectorList
                    title="Retail & Consumer"
                    symbols={['WMT', 'TGT', 'COST', 'KO', 'PEP', 'NKE', 'MCD']}
                />
            </div>
        </div>
    );
}
