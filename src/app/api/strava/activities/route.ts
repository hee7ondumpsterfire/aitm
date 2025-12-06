import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('refresh') === 'true';

    const cookieStore = await cookies();
    let accessToken = cookieStore.get('strava_access_token')?.value;
    const refreshToken = cookieStore.get('strava_refresh_token')?.value;
    const expiresAt = cookieStore.get('strava_expires_at')?.value;
    const stravaId = cookieStore.get('strava_athlete_id')?.value;

    const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
    const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;

    // Check if token is expired or about to expire (within 5 minutes)
    const isExpired = expiresAt && Date.now() / 1000 > (parseInt(expiresAt) - 300);

    if (isExpired && refreshToken && STRAVA_CLIENT_ID && STRAVA_CLIENT_SECRET) {
        console.log('Access token expired, attempting to refresh...');
        try {
            const refreshResponse = await axios.post('https://www.strava.com/oauth/token', {
                client_id: STRAVA_CLIENT_ID,
                client_secret: STRAVA_CLIENT_SECRET,
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            });

            const { access_token: newAccessToken, refresh_token: newRefreshToken, expires_at: newExpiresAt } = refreshResponse.data;

            // Update variables
            accessToken = newAccessToken;

            // Note: We cannot easily set cookies here and continue execution in the same way as standard response
            // But we can set them on the response object we return later... OR we can try modifying the store if Next.js allows
            // In Next.js App Router Route Handlers, cookieStore.set() works for outgoing response usually.
            cookieStore.set('strava_access_token', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            cookieStore.set('strava_refresh_token', newRefreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
            cookieStore.set('strava_expires_at', newExpiresAt.toString(), { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

            console.log('Token refreshed successfully');

        } catch (refreshError) {
            console.error('Failed to refresh token:', refreshError);
            // If refresh fails, we can't do anything but proceed (likely to fail) or return 401
            return NextResponse.json({ error: 'Session expired, please login again' }, { status: 401 });
        }
    }

    if (!accessToken) {
        accessToken = process.env.STRAVA_ACCESS_TOKEN_FALLBACK;
    }

    if (!accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Check Cache (skip if forceRefresh is true)
    if (stravaId && !forceRefresh) {
        const { getUserSettings } = await import('@/lib/db');
        const userData = await getUserSettings(Number(stravaId));
        const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

        if (userData?.activities && userData?.lastActivityFetch) {
            const isFresh = (Date.now() - userData.lastActivityFetch) < CACHE_DURATION;
            if (isFresh) {
                console.log('Serving activities from cache');
                return NextResponse.json(userData.activities);
            }
        }
    }

    const MAX_RETRIES = 3;
    let lastError;

    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            // Fetch last 90 days of activities (approx 3 months)
            const after = Math.floor((Date.now() - 90 * 24 * 60 * 60 * 1000) / 1000);
            let page = 1;
            let allActivities: any[] = [];
            let keepFetching = true;

            while (keepFetching) {
                console.log(`Fetching activities page ${page}...`);
                const response = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    params: {
                        after,
                        per_page: 200, // Max per page
                        page: page,
                    },
                });

                const pageActivities = response.data;
                if (pageActivities.length === 0) {
                    keepFetching = false;
                } else {
                    allActivities = [...allActivities, ...pageActivities];
                    page++;
                    // Safety break to prevent infinite loops if user has massive history
                    if (page > 10) keepFetching = false;
                }
            }

            const activities = allActivities;

            // 2. Save to Cache
            if (stravaId) {
                const { getUserSettings, saveUserSettings } = await import('@/lib/db');
                const currentSettings = await getUserSettings(Number(stravaId));
                if (currentSettings) {
                    await saveUserSettings(Number(stravaId), {
                        ...currentSettings,
                        activities,
                        lastActivityFetch: Date.now()
                    });
                }
            }

            return NextResponse.json(activities);
        } catch (error: any) {
            lastError = error;
            const status = error.response?.status;
            console.error(`Attempt ${i + 1} failed with status ${status}:`, error.message);

            // Retry only on 5xx errors or 597
            if (status && (status >= 500 || status === 597)) {
                if (i < MAX_RETRIES - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
                    continue;
                }
            } else {
                // If it's not a retryable error (e.g. 401, 403), break immediately
                break;
            }
        }
    }

    // If we exhausted retries or encountered a non-retryable error
    console.error('Final error fetching activities:', {
        message: lastError.message,
        status: lastError.response?.status,
        data: lastError.response?.data,
    });

    const status = lastError.response?.status || 500;
    const message = lastError.response?.data?.message || 'Failed to fetch activities after retries';
    return NextResponse.json({ error: message, details: lastError.response?.data }, { status });
}
