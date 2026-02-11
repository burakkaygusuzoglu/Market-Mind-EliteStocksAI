import { NextRequest, NextResponse } from 'next/server';
import { fetchFromFinnhub, createErrorResponse } from '@/app/lib/finnhub';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');
    const resolution = searchParams.get('resolution') || 'D';

    // Default time range: 3 months
    const now = Math.floor(Date.now() / 1000);
    const threeMonthsAgo = now - (90 * 24 * 60 * 60);

    const to = searchParams.get('to') || now.toString();
    const from = searchParams.get('from') || threeMonthsAgo.toString();

    if (!symbol) {
        return NextResponse.json({ error: 'Query parameter "symbol" is required' }, { status: 400 });
    }

    try {
        console.log(`Fetching candles for ${symbol} range: ${from} to ${to} res: ${resolution}`);
        const data = await fetchFromFinnhub('/stock/candle', { symbol, resolution, from, to });

        if (data.s === 'no_data') {
            console.warn(`No candle data returned for ${symbol}`);
        }


        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
            },
        });
    } catch (error: any) {
        console.error(`Finnhub Candle Error for ${symbol}:`, error);
        return createErrorResponse(error);
    }
}
