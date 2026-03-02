import Dashboard from '@/components/Dashboard';
import { getCachedData, setCachedData } from '@/lib/cache';
import { fetchAllDeals } from '@/lib/hubspot';
import { transformData } from '@/lib/transform';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let initialData = null;

  try {
    initialData = await getCachedData();

    // Invalidate cache if it's missing v2 fields
    if (initialData && !initialData.budgetProgress) {
      initialData = null;
    }

    if (!initialData) {
      const { closedWon, active, closedLost } = await fetchAllDeals();
      initialData = transformData(closedWon, active, closedLost);
      await setCachedData(initialData);
    }
  } catch (e) {
    console.error('Failed to load data:', e);
  }

  return <Dashboard initialData={initialData} />;
}
