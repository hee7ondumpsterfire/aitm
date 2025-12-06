import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get('strava_access_token')?.value;

    if (!accessToken) {
        accessToken = process.env.STRAVA_ACCESS_TOKEN_FALLBACK;
    }

    if (!accessToken) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    try {
        const response = await axios.get('https://www.strava.com/api/v3/athlete', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error fetching Strava profile:', error);
        return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }
}
