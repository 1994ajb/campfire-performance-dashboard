import { DashboardData } from './types';

const CACHE_KEY = 'dashboard-data-v4';

let memoryCache: { data: DashboardData; timestamp: number } | null = null;
const MEMORY_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getKV() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const { kv } = await import('@vercel/kv');
      return kv;
    } catch {
      return null;
    }
  }
  return null;
}

export async function getCachedData(): Promise<DashboardData | null> {
  // Check memory cache first
  if (memoryCache && Date.now() - memoryCache.timestamp < MEMORY_CACHE_TTL) {
    return memoryCache.data;
  }

  // Try Vercel KV
  const kv = await getKV();
  if (kv) {
    try {
      const data = await kv.get<DashboardData>(CACHE_KEY);
      if (data) {
        memoryCache = { data, timestamp: Date.now() };
        return data;
      }
    } catch (e) {
      console.error('KV read error:', e);
    }
  }

  return null;
}

export async function setCachedData(data: DashboardData): Promise<void> {
  // Always set memory cache
  memoryCache = { data, timestamp: Date.now() };

  // Try Vercel KV
  const kv = await getKV();
  if (kv) {
    try {
      // Cache for 24 hours
      await kv.set(CACHE_KEY, data, { ex: 86400 });
    } catch (e) {
      console.error('KV write error:', e);
    }
  }
}
