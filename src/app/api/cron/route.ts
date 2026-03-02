import { NextResponse } from 'next/server';
import { fetchAllDeals } from '@/lib/hubspot';
import { transformData } from '@/lib/transform';
import { setCachedData } from '@/lib/cache';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const { closedWon, active, closedLost } = await fetchAllDeals();
    const data = transformData(closedWon, active, closedLost);
    await setCachedData(data);

    return NextResponse.json({ success: true, updatedAt: data.updatedAt });
  } catch (error) {
    console.error('Cron refresh error:', error);
    return NextResponse.json(
      { success: false, error: 'Cron refresh failed' },
      { status: 500 }
    );
  }
}
