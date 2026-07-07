import { NextResponse } from 'next/server';

import { getPublicLandingData } from '@/landing/data';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET() {
  const data = await getPublicLandingData();

  return NextResponse.json(data, {
    headers: {
      ...CORS_HEADERS,
      'Cache-Control': 'no-store',
    },
  });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
