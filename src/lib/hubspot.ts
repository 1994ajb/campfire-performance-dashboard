import {
  Deal,
  OWNER_MAP,
  EXCLUDED_OWNER_ID,
  STAGE_MAP,
  ACTIVE_STAGES,
} from './types';

const HUBSPOT_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN || '';
const BASE_URL = 'https://api.hubapi.com';

const DEAL_PROPERTIES = [
  'dealname',
  'amount',
  'hubspot_owner_id',
  'closedate',
  'dealstage',
  'dealtype',
  'services',
  'project_length_duration_in_months',
  'reactive_or_proactive_proposal',
  'num_contacted_notes',
  'num_associated_contacts',
];

async function hubspotFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${HUBSPOT_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HubSpot API error ${res.status}: ${text}`);
  }
  return res;
}

function getProactiveType(value: string | undefined | null): 'Proactive' | 'Reactive' | 'Untagged' {
  if (!value) return 'Untagged';
  const lower = value.toLowerCase();
  if (lower.includes('proactive')) return 'Proactive';
  if (lower.includes('reactive')) return 'Reactive';
  return 'Untagged';
}

function mapDeal(raw: Record<string, unknown>, companyMap: Map<string, boolean>): Deal | null {
  const props = raw.properties as Record<string, string | null>;
  const ownerId = props.hubspot_owner_id || '';

  // Exclude Sophie Angell
  if (ownerId === EXCLUDED_OWNER_ID) return null;

  const dealId = raw.id as string;
  const stage = props.dealstage || '';
  const ownerName = OWNER_MAP[ownerId] || `Unknown (${ownerId})`;

  return {
    id: dealId,
    name: props.dealname || 'Unnamed Deal',
    amount: parseFloat(props.amount || '0') || 0,
    ownerId,
    ownerName,
    closeDate: props.closedate || '',
    stage,
    stageName: STAGE_MAP[stage] || stage,
    dealType: props.dealtype || '',
    services: props.services || '',
    projectLength: props.project_length_duration_in_months || '',
    proactiveReactive: props.reactive_or_proactive_proposal || '',
    syncedEmails: parseInt(props.num_contacted_notes || '0', 10) || 0,
    linkedContacts: parseInt(props.num_associated_contacts || '0', 10) || 0,
    hasLinkedCompany: companyMap.get(dealId) || false,
    type: getProactiveType(props.reactive_or_proactive_proposal),
  };
}

export async function fetchClosedWonDeals(): Promise<Deal[]> {
  const deals: Deal[] = [];
  let after: string | undefined;

  do {
    const body: Record<string, unknown> = {
      filterGroups: [
        {
          filters: [
            { propertyName: 'dealstage', operator: 'EQ', value: 'closedwon' },
            { propertyName: 'closedate', operator: 'GTE', value: '2026-01-01' },
          ],
        },
      ],
      properties: DEAL_PROPERTIES,
      sorts: [{ propertyName: 'amount', direction: 'DESCENDING' }],
      limit: 100,
      ...(after ? { after } : {}),
    };

    const res = await hubspotFetch('/crm/v3/objects/deals/search', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const data = await res.json();
    const results = data.results || [];

    // Batch fetch company associations
    const dealIds = results.map((d: Record<string, unknown>) => d.id as string);
    const companyMap = await fetchCompanyAssociations(dealIds);

    for (const raw of results) {
      const deal = mapDeal(raw, companyMap);
      if (deal) deals.push(deal);
    }

    after = data.paging?.next?.after;
  } while (after);

  return deals;
}

export async function fetchActiveDeals(): Promise<Deal[]> {
  const deals: Deal[] = [];

  for (const stageId of ACTIVE_STAGES) {
    let after: string | undefined;
    do {
      const body: Record<string, unknown> = {
        filterGroups: [
          {
            filters: [
              { propertyName: 'dealstage', operator: 'EQ', value: stageId },
            ],
          },
        ],
        properties: DEAL_PROPERTIES,
        sorts: [{ propertyName: 'amount', direction: 'DESCENDING' }],
        limit: 100,
        ...(after ? { after } : {}),
      };

      const res = await hubspotFetch('/crm/v3/objects/deals/search', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const data = await res.json();
      const results = data.results || [];

      const dealIds = results.map((d: Record<string, unknown>) => d.id as string);
      const companyMap = await fetchCompanyAssociations(dealIds);

      for (const raw of results) {
        const deal = mapDeal(raw, companyMap);
        if (deal) deals.push(deal);
      }

      after = data.paging?.next?.after;
    } while (after);
  }

  return deals;
}

async function fetchCompanyAssociations(dealIds: string[]): Promise<Map<string, boolean>> {
  const map = new Map<string, boolean>();
  if (dealIds.length === 0) return map;

  try {
    const res = await hubspotFetch('/crm/v4/associations/deals/companies/batch/read', {
      method: 'POST',
      body: JSON.stringify({
        inputs: dealIds.map(id => ({ id })),
      }),
    });
    const data = await res.json();
    for (const result of (data.results || [])) {
      const dealId = result.from?.id;
      const hasCompany = (result.to || []).length > 0;
      if (dealId) map.set(String(dealId), hasCompany);
    }
  } catch {
    // If batch associations fail, fall back to marking all as unknown
    for (const id of dealIds) {
      map.set(id, false);
    }
  }

  // Ensure all IDs have an entry
  for (const id of dealIds) {
    if (!map.has(id)) map.set(id, false);
  }

  return map;
}

export async function fetchAllDeals(): Promise<{ closedWon: Deal[]; active: Deal[] }> {
  const [closedWon, active] = await Promise.all([
    fetchClosedWonDeals(),
    fetchActiveDeals(),
  ]);
  return { closedWon, active };
}
