import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    try {
        const response = await axios.post('https://www.strava.com/oauth/token', {
            client_id: STRAVA_CLIENT_ID,
            client_secret: STRAVA_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
        });

        const { access_token, refresh_token, expires_at, athlete } = response.data;

        // Store tokens in cookies
        const cookieStore = await cookies();
        cookieStore.set('strava_access_token', access_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        cookieStore.set('strava_refresh_token', refresh_token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        cookieStore.set('strava_expires_at', expires_at.toString(), { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        // Redirect to dashboard
        return NextResponse.redirect(new URL('/', request.url));

    } catch (error) {
        console.error('Error exchanging token:', error);
        return NextResponse.json({ error: 'Failed to exchange token' }, { status: 500 });
    }
}
