import { NextResponse } from 'next/server';

export async function GET() {
    const clientId = process.env.STRAVA_CLIENT_ID || '89881';
    const redirectUri = 'http://localhost:3000/api/auth/callback';
    const scope = 'activity:read_all,profile:read_all';

    const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=${scope}`;

    return NextResponse.redirect(stravaAuthUrl);
}
