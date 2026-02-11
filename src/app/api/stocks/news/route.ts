import { NextRequest, NextResponse } from 'next/server';
import { fetchFromFinnhub, createErrorResponse } from '@/app/lib/finnhub';
import { format, subDays } from 'date-fns';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol');

    if (!symbol) {
        return NextResponse.json({ error: 'Query parameter "symbol" is required' }, { status: 400 });
    }

    // Get news from the last 3 days
    const today = new Date();
    const threeDaysAgo = subDays(today, 3);
    const from = format(threeDaysAgo, 'yyyy-MM-dd');
    const to = format(today, 'yyyy-MM-dd');

    try {
        const data = await fetchFromFinnhub('/company-news', { symbol, from, to });

        // Slice to return only top 5 recent news, saving bandwidth
        const topNews = Array.isArray(data) ? data.slice(0, 5) : [];

        // Add Cache-Control header for 15 minutes
        return NextResponse.json(topNews, {
            headers: {
                'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=600',
            },
        });
    } catch (error) {
        return createErrorResponse(error);
    }
}
