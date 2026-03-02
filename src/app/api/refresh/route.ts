import { NextResponse } from 'next/server';
import { fetchAllDeals } from '@/lib/hubspot';
import { transformData } from '@/lib/transform';
import { setCachedData } from '@/lib/cache';

export async function POST() {
  try {
    const { closedWon, active } = await fetchAllDeals();
    const data = transformData(closedWon, active);
    await setCachedData(data);

    return NextResponse.json({
      success: true,
      updatedAt: data.updatedAt,
    });
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to refresh data' },
      { status: 500 }
    );
  }
}
