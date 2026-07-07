'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';

import { type AppDatabase } from '@/cms/types';
import { type AppLocale } from '@/i18n/routing';

import { type PublicLandingData } from './data';

interface LandingPageProps {
  data: PublicLandingData;
  locale: AppLocale;
}

const formatMoney = (value: number, locale: AppLocale) => {
  return `${value.toLocaleString(locale === 'en' ? 'en-US' : 'vi-VN')}d`;
};

export function LandingPage({ data, locale }: LandingPageProps) {
  const [landingData, setLandingData] = useState(data);
  const isEnglish = locale === 'en';
  const heroTitle = isEnglish ? landingData.content.heroTitleEn : landingData.content.heroTitleVi;
  const heroDesc = isEnglish ? landingData.content.heroDescEn : landingData.content.heroDescVi;
  const featuredProduct = landingData.products[0];

  useEffect(() => {
    fetch('/api/public/landing', { cache: 'no-store' })
      .then(response => (response.ok ? response.json() : Promise.reject(new Error('Landing API unavailable'))))
      .then((nextData: PublicLandingData) => setLandingData(nextData))
      .catch(() => {
        const raw = localStorage.getItem('auratea_cms_only');
        if (!raw) return;

        try {
          const localData = JSON.parse(raw) as AppDatabase;
          setLandingData({
            products: localData.products.filter(product => product.active),
            toppings: localData.toppings.filter(topping => topping.active),
            offers: localData.offers.filter(offer => offer.active),
            categories: localData.categories,
            media: localData.media,
            content: localData.content,
            settings: localData.settings,
          });
        } catch {
          // Keep server-rendered data if local CMS data is not readable.
        }
      });
  }, []);

  return (
    <main className="min-h-screen bg-[#fff8ef] text-[#321b12]">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-[#fff8ef]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href={`/${locale}`} className="text-lg uppercase tracking-[0.18em]">
            {landingData.settings.shopName}
          </a>
          <nav className="hidden items-center gap-6 text-sm text-[#6a3d29] sm:flex">
            <a href="#menu" className="hover:text-[#c98632]">
              {isEnglish ? 'Menu' : 'Menu'}
            </a>
            <a href="#offers" className="hover:text-[#c98632]">
              {isEnglish ? 'Offers' : 'Uu dai'}
            </a>
            <a href="#contact" className="hover:text-[#c98632]">
              {isEnglish ? 'Contact' : 'Lien he'}
            </a>
          </nav>
          <a
            href={`/${locale}/admin`}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs text-[#6a3d29] shadow-sm transition hover:border-[#c98632]"
          >
            CMS
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
        <div className="space-y-7">
          <div className="inline-flex rounded-full border border-[#daa94f]/30 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.18em] text-[#8b7668]">
            Fresh milk tea every day
          </div>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              {heroTitle}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[#6a3d29] sm:text-lg">
              {heroDesc}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="#menu"
              className="rounded-full bg-[#321b12] px-6 py-3 text-sm text-white shadow-lg shadow-[#321b12]/10 transition hover:bg-[#4a291d]"
            >
              {landingData.content.ctaButton}
            </a>
            <a
              href={`tel:${landingData.settings.shopPhone.replaceAll(' ', '')}`}
              className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm text-[#321b12] transition hover:border-[#c98632]"
            >
              {landingData.settings.shopPhone}
            </a>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-black/5 bg-[#fdf1df]">
          {featuredProduct ? (
            <>
              <img
                src={featuredProduct.image}
                alt={featuredProduct.name}
                className="absolute inset-0 h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#321b12]/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/75">
                  {featuredProduct.tag || (isEnglish ? 'Featured' : 'Noi bat')}
                </div>
                <h2 className="text-3xl">{featuredProduct.name}</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-white/80">{featuredProduct.desc}</p>
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-[420px] items-center justify-center p-8 text-center text-[#8b7668]">
              {isEnglish ? 'No products are available yet.' : 'Chua co san pham dang ban.'}
            </div>
          )}
        </div>
      </section>

      <section id="menu" className="mx-auto max-w-7xl px-5 py-12">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#8b7668]">
              {isEnglish ? 'Today menu' : 'Menu hom nay'}
            </p>
            <h2 className="text-4xl tracking-tight">{isEnglish ? 'Milk tea selection' : 'Danh sach san pham'}</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#6a3d29]">
            {isEnglish
              ? 'Products marked as selling in CMS appear here automatically.'
              : 'San pham co trang thai dang ban trong CMS se tu dong hien thi o day.'}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {landingData.products.map(product => (
            <article key={product.id} className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
              <div className="aspect-[4/3] overflow-hidden bg-[#f6e5cb]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl">{product.name}</h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[#8b7668]">{product.category}</p>
                  </div>
                  {product.tag && (
                    <span className="rounded-full bg-[#fff8ef] px-3 py-1 text-[11px] text-[#c98632]">
                      {product.tag}
                    </span>
                  )}
                </div>
                <p className="min-h-[72px] text-sm leading-6 text-[#6a3d29]">{product.desc}</p>
                <div className="flex items-center justify-between border-t border-black/5 pt-3 text-sm">
                  <span>M {formatMoney(product.priceM, locale)}</span>
                  <span>L {formatMoney(product.priceL, locale)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="offers" className="mx-auto grid max-w-7xl gap-6 px-5 py-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-2xl bg-[#321b12] p-7 text-white">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-white/60">
            {isEnglish ? 'Why us' : 'Cau chuyen'}
          </p>
          <h2 className="text-3xl">{landingData.content.storyTitle}</h2>
          <p className="mt-4 text-sm leading-7 text-white/75">{landingData.content.storyDesc}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {landingData.offers.map(offer => (
            <article key={offer.id} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
              <h3 className="text-xl">{offer.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#6a3d29]">{offer.desc}</p>
              <p className="mt-4 text-xs text-[#8b7668]">
                {offer.start} - {offer.end}
              </p>
            </article>
          ))}
        </div>
      </section>

      <footer id="contact" className="border-t border-black/5 bg-white/60">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 text-sm text-[#6a3d29] sm:grid-cols-3">
          <div>
            <div className="mb-2 text-lg text-[#321b12]">{landingData.settings.shopName}</div>
            <div>{landingData.content.ctaText}</div>
          </div>
          <div>
            <div>{landingData.settings.shopAddress}</div>
            <div>{landingData.settings.shopHours}</div>
          </div>
          <div className="sm:text-right">
            <a href={`tel:${landingData.settings.shopPhone.replaceAll(' ', '')}`} className="block hover:text-[#c98632]">
              {landingData.settings.shopPhone}
            </a>
            <a href={`mailto:${landingData.settings.shopEmail}`} className="block hover:text-[#c98632]">
              {landingData.settings.shopEmail}
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
