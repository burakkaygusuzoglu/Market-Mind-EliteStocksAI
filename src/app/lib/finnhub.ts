import { NextResponse } from 'next/server';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

if (!process.env.FINNHUB_API_KEY) {
    console.warn('WARNING: FINNHUB_API_KEY is not set in environment variables.');
}

export const fetchFromFinnhub = async (endpoint: string, params: Record<string, string> = {}) => {
    const apiKey = process.env.FINNHUB_API_KEY;

    if (!apiKey) {
        throw new Error('Server configuration error: API key missing');
    }

    const url = new URL(`${FINNHUB_BASE_URL}${endpoint}`);
    url.searchParams.append('token', apiKey);

    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
    });

    try {
        const res = await fetch(url.toString(), {
            next: { revalidate: 0 } // handled by controller logic or higher level cache
        });

        if (!res.ok) {
            if (res.status === 429) {
                throw new Error('Rate limit exceeded');
            }
            throw new Error(`Finnhub API error: ${res.statusText}`);
        }

        return await res.json();
    } catch (error: any) {
        console.error(`Error fetching ${endpoint}:`, error.message);
        throw error;
    }
};

export const createErrorResponse = (error: any) => {
    const message = error.message || 'Internal Server Error';
    const status = message === 'Rate limit exceeded' ? 429 : 500;
    return NextResponse.json({ error: message }, { status });
};
