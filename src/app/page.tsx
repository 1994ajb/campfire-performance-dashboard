import Dashboard from '@/components/Dashboard';
import { getCachedData } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let initialData = null;

  try {
    initialData = await getCachedData();
  } catch (e) {
    console.error('Failed to load cached data:', e);
  }

  return <Dashboard initialData={initialData} />;
}
