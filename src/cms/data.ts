import { type AppDatabase } from './types';

export const uid = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
};

export const initialSampleData: AppDatabase = {
  categories: [
    { id: 'cat1', name: "Trà sữa", desc: "Nhóm đồ uống có nền trà và sữa" },
    { id: 'cat2', name: "Matcha", desc: "Các món matcha kem sữa" },
    { id: 'cat3', name: "Trà trái cây", desc: "Trà thanh mát, nhiều trái cây" }
  ],
  products: [
    {
      id: 'p1',
      name: "Trà sữa đường đen",
      category: "Trà sữa",
      tag: "Bán chạy",
      priceM: 39000,
      priceL: 49000,
      image: "/milktea-assets/clean-brown-sugar-cutout.png",
      desc: "Trà sữa thơm đậm, sữa tươi béo nhẹ và trân châu đường đen nấu mới mỗi ngày.",
      active: true
    },
    {
      id: 'p2',
      name: "Matcha kem sữa",
      category: "Matcha",
      tag: "Vị thanh",
      priceM: 45000,
      priceL: 55000,
      image: "/milktea-assets/clean-matcha-cutout.png",
      desc: "Matcha xanh thơm, lớp kem sữa béo nhẹ và hậu vị mát hợp ngày nắng.",
      active: true
    },
    {
      id: 'p3',
      name: "Khoai môn mây tím",
      category: "Trà sữa",
      tag: "Món mới",
      priceM: 42000,
      priceL: 52000,
      image: "/milktea-assets/clean-taro-cutout.png",
      desc: "Khoai môn tím thơm, chất sữa mịn và màu ly nổi bật.",
      active: true
    },
    {
      id: 'p4',
      name: "Ô long đào",
      category: "Trà trái cây",
      tag: "Fresh",
      priceM: 43000,
      priceL: 53000,
      image: "/milktea-assets/clean-oolong-peach-cutout-v2.png",
      desc: "Trà ô long thơm nhẹ kết hợp đào tươi, thanh mát và dễ uống.",
      active: true
    }
  ],
  toppings: [
    { id: 'top1', name: "Trân châu đen", price: 7000, active: true },
    { id: 'top2', name: "Trân châu trắng", price: 7000, active: true },
    { id: 'top3', name: "Thạch đào", price: 6000, active: true },
    { id: 'top4', name: "Pudding trứng", price: 8000, active: true },
    { id: 'top5', name: "Kem cheese", price: 10000, active: true }
  ],
  materials: [
    { id: 'mat1', name: "Lá trà đen", qty: 12, unit: "kg", min: 5 },
    { id: 'mat2', name: "Sữa tươi", qty: 45, unit: "lít", min: 15 },
    { id: 'mat3', name: "Trân châu", qty: 20, unit: "kg", min: 8 },
    { id: 'mat4', name: "Bột matcha", qty: 4, unit: "kg", min: 5 }
  ],
  staff: [
    { id: 'st1', name: "Mai Linh", role: "Pha chế", phone: "0900000001", active: true },
    { id: 'st2', name: "Quang Huy", role: "Giao hàng", phone: "0900000002", active: true },
    { id: 'st3', name: "Thanh Tùng", role: "Thu ngân", phone: "0900000003", active: true }
  ],
  orders: [
    { id: "#AUR12345", customer: "Mai Linh", items: "Trà sữa đường đen x2", total: 139000, status: "Đang pha", time: "10:30" },
    { id: "#AUR12344", customer: "Thanh Tùng", items: "Matcha kem sữa x2", total: 98000, status: "Đang giao", time: "10:15" },
    { id: "#AUR12343", customer: "Phương Anh", items: "Khoai môn mây tím x3", total: 187000, status: "Hoàn thành", time: "09:58" },
    { id: "#AUR12342", customer: "Quang Huy", items: "Ô long đào x3", total: 156000, status: "Đang pha", time: "09:42" },
    { id: "#AUR12341", customer: "Minh Châu", items: "Trà sữa đường đen x2", total: 112000, status: "Hoàn thành", time: "09:30" }
  ],
  offers: [
    { id: 'off1', title: "Mua 2 ly giảm 15%", desc: "Áp dụng cho nhóm bạn trong hôm nay.", start: "2026-07-01", end: "2026-07-31", active: true },
    { id: 'off2', title: "Miễn phí topping đơn đầu", desc: "Dành cho khách đặt lần đầu.", start: "2026-07-01", end: "2026-07-31", active: true },
    { id: 'off3', title: "Giảm 20% cho sinh viên", desc: "Cần xuất trình thẻ sinh viên.", start: "2026-07-01", end: "2026-07-31", active: true }
  ],
  media: [
    { id: 'm1', name: "Trà sữa đường đen", url: "/milktea-assets/clean-brown-sugar-cutout.png" },
    { id: 'm2', name: "Matcha kem sữa", url: "/milktea-assets/clean-matcha-cutout.png" },
    { id: 'm3', name: "Khoai môn mây tím", url: "/milktea-assets/clean-taro-cutout.png" },
    { id: 'm4', name: "Ô long đào", url: "/milktea-assets/clean-oolong-peach-cutout-v2.png" }
  ],
  content: {
    heroTitleVi: "Trà thơm đúng vị, ngọt vừa đúng gu.",
    heroDescVi: "AURATEA mang đến những ly trà sữa tươi mới mỗi ngày, trân châu nấu tại cửa hàng.",
    heroTitleEn: "Fresh tea, soft sweetness, made for your taste.",
    heroDescEn: "AURATEA serves fresh milk tea every day with handmade pearls.",
    storyTitle: "Một ly ngon bắt đầu từ nguyên liệu tốt",
    storyDesc: "Trà ủ mới, trân châu nấu mỗi ngày và pha theo khẩu vị của khách.",
    ctaText: "Đặt trà ngay hôm nay",
    ctaButton: "Đặt hàng"
  },
  settings: {
    shopName: "AURATEA",
    shopAddress: "Đà Nẵng, Việt Nam",
    shopPhone: "0900 000 000",
    shopEmail: "hello@auratea.vn",
    shopHours: "08:00 - 22:00"
  }
};

const STORAGE_KEY = 'auratea_cms_only';

const cloneInitialData = (): AppDatabase => {
  return JSON.parse(JSON.stringify(initialSampleData));
};

export const loadDatabase = (): AppDatabase => {
  if (typeof window === 'undefined') return initialSampleData;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSampleData));
    return cloneInitialData();
  }
  try {
    const data = JSON.parse(raw) as AppDatabase;
    let updated = false;
    const unsplashMapping: Record<string, string> = {
      "https://images.unsplash.com/photo-1558857563-b371033873b8?q=80&w=900&auto=format&fit=crop": "/milktea-assets/clean-brown-sugar-cutout.png",
      "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=900&auto=format&fit=crop": "/milktea-assets/clean-matcha-cutout.png",
      "https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?q=80&w=900&auto=format&fit=crop": "/milktea-assets/clean-taro-cutout.png",
      "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?q=80&w=900&auto=format&fit=crop": "/milktea-assets/clean-oolong-peach-cutout-v2.png"
    };

    if (data.products && Array.isArray(data.products)) {
      data.products = data.products.map(p => {
        const localImage = unsplashMapping[p.image];
        if (localImage) {
          p.image = localImage;
          updated = true;
        }
        return p;
      });
    }

    if (data.media && Array.isArray(data.media)) {
      data.media = data.media.map(m => {
        const localUrl = unsplashMapping[m.url];
        if (localUrl) {
          m.url = localUrl;
          updated = true;
        }
        return m;
      });
    }

    if (updated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    return data;
  } catch (e) {
    console.error('Error parsing stored database, resetting to sample.', e);
    return cloneInitialData();
  }
};

export const saveDatabase = (db: AppDatabase): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

export const loadDatabaseFromApi = async (): Promise<AppDatabase> => {
  const response = await fetch('/api/cms/database', {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Failed to load CMS database: ${response.status}`);
  }

  const db = (await response.json()) as AppDatabase;
  saveDatabase(db);

  return db;
};

export const saveDatabaseToApi = async (db: AppDatabase): Promise<void> => {
  saveDatabase(db);

  const response = await fetch('/api/cms/database', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(db),
  });

  if (!response.ok) {
    throw new Error(`Failed to save CMS database: ${response.status}`);
  }
};
