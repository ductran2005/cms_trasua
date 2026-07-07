import { MongoClient, type Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? 'auratea_cms';

declare global {
  var __mongoClientPromise: Promise<MongoClient> | undefined;
}

export function isMongoConfigured(): boolean {
  return Boolean(uri);
}

export async function getMongoDb(): Promise<Db> {
  if (!uri) {
    throw new Error('Missing MONGODB_URI');
  }

  globalThis.__mongoClientPromise ??= new MongoClient(uri).connect();
  const client = await globalThis.__mongoClientPromise;

  return client.db(dbName);
}
