import { NextResponse } from 'next/server';

import { initialSampleData } from '@/cms/data';
import { type AppDatabase } from '@/cms/types';
import { getMongoDb, isMongoConfigured } from '@/lib/mongodb';

const COLLECTION = 'cms_database';
const DOCUMENT_ID = 'main';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Public, read-only projection of the CMS database for the landing page.
// Never expose orders, staff or materials here.
function toPublicPayload(db: AppDatabase) {
  return {
    products: db.products.filter(p => p.active),
    toppings: db.toppings.filter(t => t.active),
    offers: db.offers.filter(o => o.active),
    categories: db.categories,
    media: db.media,
    content: db.content,
    settings: db.settings,
  };
}

export async function GET() {
  let data: AppDatabase = initialSampleData;

  if (isMongoConfigured()) {
    const db = await getMongoDb();
    const document = await db
      .collection<AppDatabase & { _id: string }>(COLLECTION)
      .findOne({ _id: DOCUMENT_ID });
    if (document) data = document;
  }

  return NextResponse.json(toPublicPayload(data), {
    headers: {
      ...CORS_HEADERS,
      'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
    },
  });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
