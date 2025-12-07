'use client';

import { Activity } from 'lucide-react';

export default function Login() {
    const STRAVA_CLIENT_ID = '89881'; // In a real app, pass this via env or props, but for client component simplicity hardcoding or using public env is fine. 
    // Better to use process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID if configured.
    // For now I will assume the user will configure NEXT_PUBLIC_STRAVA_CLIENT_ID or I will hardcode it for the prototype as requested.
    // Actually, I set STRAVA_CLIENT_ID in .env.local but not NEXT_PUBLIC_.
    // I should update .env.local to include NEXT_PUBLIC_STRAVA_CLIENT_ID or just use the value I know.
    // I'll use the value directly for now to avoid another file edit cycle just for this.

    const clientId = '89881';
    const scope = 'activity:read_all,profile:read_all';

    const handleLogin = () => {
        const redirectUri = `${window.location.origin}/api/auth/callback`;
        window.location.href = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=${scope}`;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="p-8 bg-gray-800 rounded-lg shadow-xl text-center">
                <Activity className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                <h1 className="text-3xl font-bold mb-2">Coachweek</h1>
                <p className="text-gray-400 mb-8">Data into direction, sweat into success</p>
                <button
                    onClick={handleLogin}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 flex items-center justify-center mx-auto mb-4"
                >
                    Connect with Strava
                </button>
                <a
                    href="/?guest=true"
                    className="text-gray-400 hover:text-white underline text-sm transition duration-300"
                >
                    Continue as Guest
                </a>
            </div>
        </div>
    );
}
