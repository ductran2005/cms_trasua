import { unstable_noStore as noStore } from 'next/cache';
import { connection } from 'next/server';

import { routing, type AppLocale } from '@/i18n/routing';
import { getPublicLandingData } from '@/landing/data';
import { LandingPage } from '@/landing/LandingPage';

export const dynamic = 'force-dynamic';

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  noStore();
  await connection();

  const { locale } = await params;
  const data = await getPublicLandingData();

  return <LandingPage data={data} locale={routing.locales.includes(locale) ? locale : routing.defaultLocale} />;
}
