import { initialSampleData } from '@/cms/data';
import { type AppDatabase, type Category, type ContentState, type MediaItem, type Offer, type Product, type SettingsState, type Topping } from '@/cms/types';
import { getMongoDb, isMongoConfigured } from '@/lib/mongodb';

const COLLECTION = 'cms_database';
const DOCUMENT_ID = 'main';

export interface PublicLandingData {
  products: Product[];
  toppings: Topping[];
  offers: Offer[];
  categories: Category[];
  media: MediaItem[];
  content: ContentState;
  settings: SettingsState;
}

export function toPublicLandingPayload(db: AppDatabase): PublicLandingData {
  return {
    products: db.products.filter(product => product.active),
    toppings: db.toppings.filter(topping => topping.active),
    offers: db.offers.filter(offer => offer.active),
    categories: db.categories,
    media: db.media,
    content: db.content,
    settings: db.settings,
  };
}

export async function getPublicLandingData(): Promise<PublicLandingData> {
  let data: AppDatabase = initialSampleData;

  if (isMongoConfigured()) {
    const db = await getMongoDb();
    const document = await db
      .collection<AppDatabase & { _id: string }>(COLLECTION)
      .findOne({ _id: DOCUMENT_ID });

    if (document) {
      data = document;
    }
  }

  return toPublicLandingPayload(data);
}
