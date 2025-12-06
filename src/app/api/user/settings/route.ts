import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { getUserSettings, saveUserSettings } from '@/lib/db';

const STRAVA_API_URL = 'https://www.strava.com/api/v3';

async function getStravaId(accessToken: string): Promise<number | null> {
    try {
        const response = await axios.get(`${STRAVA_API_URL}/athlete`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data.id;
    } catch (error) {
        console.error('Error fetching Strava ID:', error);
        return null;
    }
}

async function getAccessToken(): Promise<string | null> {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('strava_access_token');
    return tokenCookie?.value || process.env.STRAVA_ACCESS_TOKEN_FALLBACK || null;
}

export async function GET() {
    const token = await getAccessToken();
    if (!token) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const stravaId = await getStravaId(token);
    if (!stravaId) {
        return NextResponse.json({ error: 'Failed to identify user' }, { status: 401 });
    }

    const settings = await getUserSettings(stravaId);
    return NextResponse.json(settings || {}); // Return empty object if no settings found
}

export async function POST(request: Request) {
    const token = await getAccessToken();
    if (!token) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const stravaId = await getStravaId(token);
    if (!stravaId) {
        return NextResponse.json({ error: 'Failed to identify user' }, { status: 401 });
    }

    try {
        const settings = await request.json();
        // Basic validation
        if (typeof settings.maxHr !== 'number' || typeof settings.ftp !== 'number') {
            return NextResponse.json({ error: 'Invalid settings data' }, { status: 400 });
        }

        await saveUserSettings(stravaId, settings);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving settings:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
