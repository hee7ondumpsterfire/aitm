import { cookies } from 'next/headers';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';

export default async function Home({ searchParams }: { searchParams: Promise<{ guest?: string }> }) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('strava_access_token');
  const { guest } = await searchParams;
  const isGuest = guest === 'true';

  return (
    <main className="min-h-screen">
      {accessToken || isGuest ? <Dashboard isGuest={isGuest} /> : <Login />}
    </main>
  );
}
