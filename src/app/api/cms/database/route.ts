import { NextResponse } from 'next/server';

import { initialSampleData } from '@/cms/data';
import { type AppDatabase } from '@/cms/types';
import { getMongoDb, isMongoConfigured } from '@/lib/mongodb';

const COLLECTION = 'cms_database';
const DOCUMENT_ID = 'main';

type CmsDocument = AppDatabase & {
  _id: string;
  updatedAt: Date;
};

function mongoNotConfiguredResponse() {
  return NextResponse.json(
    {
      error: 'MongoDB is not configured. Add MONGODB_URI to .env.local.',
    },
    { status: 503 },
  );
}

export async function GET() {
  if (!isMongoConfigured()) {
    return mongoNotConfiguredResponse();
  }

  const db = await getMongoDb();
  const collection = db.collection<CmsDocument>(COLLECTION);
  const document = await collection.findOne({ _id: DOCUMENT_ID });

  if (!document) {
    const createdDocument: CmsDocument = {
      _id: DOCUMENT_ID,
      ...JSON.parse(JSON.stringify(initialSampleData)),
      updatedAt: new Date(),
    };

    await collection.insertOne(createdDocument);

    const { _id: _createdId, updatedAt: _createdAt, ...data } = createdDocument;
    return NextResponse.json(data);
  }

  // Auto-migrate old Unsplash URLs to local assets in MongoDB
  let updated = false;
  const unsplashMapping: Record<string, string> = {
    "https://images.unsplash.com/photo-1558857563-b371033873b8?q=80&w=900&auto=format&fit=crop": "/milktea-assets/clean-brown-sugar-cutout.png",
    "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=900&auto=format&fit=crop": "/milktea-assets/clean-matcha-cutout.png",
    "https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?q=80&w=900&auto=format&fit=crop": "/milktea-assets/clean-taro-cutout.png",
    "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?q=80&w=900&auto=format&fit=crop": "/milktea-assets/clean-oolong-peach-cutout-v2.png"
  };

  if (document.products && Array.isArray(document.products)) {
    document.products = document.products.map(p => {
      const localImage = unsplashMapping[p.image];
      if (localImage) {
        p.image = localImage;
        updated = true;
      }
      return p;
    });
  }

  if (document.media && Array.isArray(document.media)) {
    document.media = document.media.map(m => {
      const localUrl = unsplashMapping[m.url];
      if (localUrl) {
        m.url = localUrl;
        updated = true;
      }
      return m;
    });
  }

  if (updated) {
    await collection.updateOne(
      { _id: DOCUMENT_ID },
      { $set: { products: document.products, media: document.media, updatedAt: new Date() } }
    );
  }

  const { _id: _documentId, updatedAt: _updatedAt, ...data } = document;
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  if (!isMongoConfigured()) {
    return mongoNotConfiguredResponse();
  }

  const nextData = (await request.json()) as AppDatabase;
  const db = await getMongoDb();
  const collection = db.collection<CmsDocument>(COLLECTION);

  await collection.updateOne(
    { _id: DOCUMENT_ID },
    {
      $set: {
        ...nextData,
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );

  return NextResponse.json({ ok: true });
}
