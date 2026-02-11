import { NextRequest, NextResponse } from 'next/server';
import { fetchFromFinnhub, createErrorResponse } from '@/app/lib/finnhub';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q');

    if (!q) {
        return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    try {
        const data = await fetchFromFinnhub('/search', { q });
        // Filter out non-common stocks if needed, or just return as is
        // Finnhub search returns a lot of noise, we might want to filter by type later if needed.
        return NextResponse.json(data);
    } catch (error) {
        return createErrorResponse(error);
    }
}
