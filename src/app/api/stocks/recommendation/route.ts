import { NextRequest, NextResponse } from 'next/server';
import { fetchFromFinnhub, createErrorResponse } from '@/app/lib/finnhub';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');

    if (!symbol) {
        return NextResponse.json({ error: 'Query parameter "symbol" is required' }, { status: 400 });
    }

    try {
        const data = await fetchFromFinnhub('/stock/recommendation', { symbol });

        // Add Cache-Control header for 6 hours
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=3600',
            },
        });
    } catch (error) {
        return createErrorResponse(error);
    }
}
