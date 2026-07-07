export interface Category {
  id: string;
  name: string;
  desc: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  tag: string;
  priceM: number;
  priceL: number;
  image: string;
  desc: string;
  active: boolean;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
  active: boolean;
}

export interface Material {
  id: string;
  name: string;
  qty: number;
  unit: string;
  min: number;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  phone: string;
  active: boolean;
}

export interface Order {
  id: string;
  customer: string;
  items: string;
  productName?: string;
  size?: 'M' | 'L' | string;
  quantity?: number;
  toppingName?: string;
  total: number;
  status: 'Đang pha' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy' | string;
  time: string;
}

export interface Offer {
  id: string;
  title: string;
  desc: string;
  start: string;
  end: string;
  active: boolean;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
}

export interface ContentState {
  heroTitleVi: string;
  heroDescVi: string;
  heroTitleEn: string;
  heroDescEn: string;
  storyTitle: string;
  storyDesc: string;
  ctaText: string;
  ctaButton: string;
}

export interface SettingsState {
  shopName: string;
  shopAddress: string;
  shopPhone: string;
  shopEmail: string;
  shopHours: string;
}

export interface AppDatabase {
  categories: Category[];
  products: Product[];
  toppings: Topping[];
  materials: Material[];
  staff: Staff[];
  orders: Order[];
  offers: Offer[];
  media: MediaItem[];
  content: ContentState;
  settings: SettingsState;
}
