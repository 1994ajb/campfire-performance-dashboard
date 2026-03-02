import { NextResponse } from 'next/server';
import { getCachedData, setCachedData } from '@/lib/cache';
import { fetchAllDeals } from '@/lib/hubspot';
import { transformData } from '@/lib/transform';

export async function GET() {
  try {
    let data = await getCachedData();

    if (!data) {
      const { closedWon, active, closedLost } = await fetchAllDeals();
      data = transformData(closedWon, active, closedLost);
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
