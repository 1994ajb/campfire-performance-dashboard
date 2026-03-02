import { NextResponse } from 'next/server';
import { getCachedData, setCachedData } from '@/lib/cache';
import { fetchAllDeals } from '@/lib/hubspot';
import { transformData } from '@/lib/transform';

export async function GET() {
  try {
    // Try cache first
    let data = await getCachedData();

    if (!data) {
      // Cache miss — fetch fresh data
      const { closedWon, active } = await fetchAllDeals();
      data = transformData(closedWon, active);
      await setCachedData(data);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Deals API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
