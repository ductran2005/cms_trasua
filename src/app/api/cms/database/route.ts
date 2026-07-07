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
