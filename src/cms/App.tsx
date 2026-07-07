'use client';

import {
  Coffee,
  FileEdit,
  FolderOpen,
  Gift,
  Image as ImageIcon,
  LayoutDashboard,
  Lock,
  Menu,
  Receipt,
  Search,
  Settings,
  Sparkles,
  Users,
  Warehouse
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

import { CategoriesView } from './components/CategoriesView';
import { ContentView } from './components/ContentView';
import { DashboardView } from './components/DashboardView';
import { MaterialsView } from './components/MaterialsView';
import { MediaView } from './components/MediaView';
import { OffersView } from './components/OffersView';
import { OrdersView } from './components/OrdersView';
import { ProductsView } from './components/ProductsView';
import { SettingsView } from './components/SettingsView';
import { StaffView } from './components/StaffView';
import { ToppingsView } from './components/ToppingsView';
import { loadDatabase, loadDatabaseFromApi, saveDatabase, saveDatabaseToApi, initialSampleData } from './data';
import { type AppDatabase, type Category, type ContentState, type Material, type MediaItem, type Offer, type Order, type Product, type SettingsState, type Staff, type Topping } from './types';

export default function App() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [db, setDb] = useState<AppDatabase>(loadDatabase());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<boolean>(false);
  
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  // Search state across sections
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);

  useEffect(() => {
    // Check local session
    const session = localStorage.getItem('auratea_admin_session');
    if (session === '1') {
      setIsLoggedIn(true);
    }

    loadDatabaseFromApi()
      .then(setDb)
      .catch((error: unknown) => {
        console.warn('Using local CMS data because MongoDB API is unavailable.', error);
      });
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const switchLocale = (nextLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    router.push(segments.join('/') || `/${nextLocale}`);
  };

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsLoggedIn(true);
      setLoginError(false);
      localStorage.setItem('auratea_admin_session', '1');
      triggerToast('ÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ng nhÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â­p thÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â nh cÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â´ng');
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('auratea_admin_session');
  };

  const updateDatabase = async (nextDb: AppDatabase): Promise<void> => {
    setDb(nextDb);
    saveDatabase(nextDb);
    try {
      await saveDatabaseToApi(nextDb);
    } catch (error: unknown) {
      console.error('Could not sync CMS database to MongoDB.', error);
      triggerToast('Khong the luu MongoDB, da luu tam tren trinh duyet');
      throw error;
    }
  };

  // Specific updaters
  const handleUpdateProducts = (products: Product[]) => {
    updateDatabase({ ...db, products });
  };

  const handleUpdateOrders = async (orders: Order[]): Promise<void> => {
    await updateDatabase({ ...db, orders });
  };

  const handleUpdateCategories = (categories: Category[]) => {
    updateDatabase({ ...db, categories });
  };

  const handleUpdateToppings = (toppings: Topping[]) => {
    updateDatabase({ ...db, toppings });
  };

  const handleUpdateMaterials = (materials: Material[]) => {
    updateDatabase({ ...db, materials });
  };

  const handleUpdateStaff = (staff: Staff[]) => {
    updateDatabase({ ...db, staff });
  };

  const handleUpdateOffers = (offers: Offer[]) => {
    updateDatabase({ ...db, offers });
  };

  const handleUpdateContent = (content: ContentState) => {
    updateDatabase({ ...db, content });
  };

  const handleUpdateMedia = (media: MediaItem[]) => {
    updateDatabase({ ...db, media });
  };

  const handleUpdateSettings = (settings: SettingsState) => {
    updateDatabase({ ...db, settings });
  };

  const handleResetData = () => {
    if (window.confirm('Reset toÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â n bÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ dÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»Ãƒâ€šÃ‚Â¯ liÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡u vÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»Ãƒâ€šÃ‚Â trÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â¡ng thÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¡i mÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â«u?')) {
      updateDatabase(JSON.parse(JSON.stringify(initialSampleData)));
      triggerToast('ÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€šÃ‚ÂÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£ khÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â´i phÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»Ãƒâ€šÃ‚Â¥c dÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»Ãƒâ€šÃ‚Â¯ liÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡u mÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â«u');
    }
  };
  const handleGlobalSearch = (val: string) => {
    setGlobalSearch(val);
    if (!val.trim()) return;

    const term = val.toLowerCase().trim();
    
    // Check if matching a product name
    const hasProduct = db.products.some(p => p.name.toLowerCase().includes(term));
    if (hasProduct) {
      setActiveView('products');
      return;
    }

    // Check staff
    const hasStaff = db.staff.some(s => s.name.toLowerCase().includes(term));
    if (hasStaff) {
      setActiveView('staff');
      return;
    }

    // Check order
    const hasOrder = db.orders.some(o => o.id.toLowerCase().includes(term) || o.customer.toLowerCase().includes(term));
    if (hasOrder) {
      setActiveView('orders');
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard, section: t('nav.overview') },
    { id: 'orders', label: t('nav.orders'), icon: Receipt, section: t('nav.overview') },

    { id: 'products', label: t('nav.products'), icon: Coffee, section: t('nav.menuManagement') },
    { id: 'categories', label: t('nav.categories'), icon: FolderOpen, section: t('nav.menuManagement') },
    { id: 'toppings', label: t('nav.toppings'), icon: Sparkles, section: t('nav.menuManagement') },

    { id: 'materials', label: t('nav.materials'), icon: Warehouse, section: t('nav.operations') },
    { id: 'staff', label: t('nav.staff'), icon: Users, section: t('nav.operations') },

    { id: 'offers', label: t('nav.offers'), icon: Gift, section: t('nav.content') },
    { id: 'content', label: t('nav.homeContent'), icon: FileEdit, section: t('nav.content') },
    { id: 'media', label: t('nav.media'), icon: ImageIcon, section: t('nav.content') },

    { id: 'settings', label: t('nav.settings'), icon: Settings, section: t('nav.system') },
  ];

  const sections = [
    t('nav.overview'),
    t('nav.menuManagement'),
    t('nav.operations'),
    t('nav.content'),
    t('nav.system'),
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Side decorative background */}
        <div className="hidden lg:flex lg:col-span-7 bg-[#271811] relative p-16 flex-col justify-between text-white bg-cover bg-center"
             style={{ backgroundImage: `linear-gradient(135deg, rgba(50,27,18,0.96), rgba(93,53,31,0.92)), url("https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=1400&auto=format&fit=crop")` }}>
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#edc96a] to-[#b66c2d] text-white flex items-center justify-center text-xl font-bold font-mono shadow-xl">A</span>
            <span className="text-xl tracking-tight uppercase">AURATEA CMS</span>
          </div>

          <div className="space-y-4 max-w-lg">
            <h1 className="text-5xl font-light tracking-tight text-white leading-none">QuÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â£n trÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¹ trÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  sÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»Ãƒâ€šÃ‚Â¯a gÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»Ãƒâ€šÃ‚Ân, ÃƒÆ’Ã¢â‚¬Å¾ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“ÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â¹p vÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  thÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»Ãƒâ€šÃ‚Â±c tÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â¿.</h1>
            <p className="text-white/70 text-sm leading-relaxed">
              HÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡ thÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“ng quÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â£n trÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¹ (CMS) dÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â nh riÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªng cho landing page trÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  sÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»Ãƒâ€šÃ‚Â¯a AURATEA: quÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â£n lÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â½ sÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â£n phÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â©m, topping, nguyÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªn vÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â­t liÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡u, nhÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢n viÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªn, ÃƒÆ’Ã¢â‚¬Â Ãƒâ€šÃ‚Â°u ÃƒÆ’Ã¢â‚¬Å¾ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â£i vÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  nÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢i dung trang chÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»Ãƒâ€šÃ‚Â§.
            </p>
          </div>

          <div className="text-xs text-white/40">ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â© 2026 AURATEA. All rights reserved.</div>
        </div>

        {/* Right Side Card Login */}
        <div className="lg:col-span-5 flex items-center justify-center p-6 bg-gradient-to-b from-[#fff8ef] to-[#fffdf8]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[420px] bg-white border border-black/8 rounded-3xl p-8 shadow-xl"
          >
            <div className="flex items-center gap-3 text-[#321b12] text-xl font-medium mb-8">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#edc96a] to-[#b66c2d] text-white flex items-center justify-center text-lg font-bold font-mono">A</span>
              <span>AURATEA CMS</span>
            </div>

            <h2 className="text-2xl font-light text-[#321b12] mb-1">ÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ng nhÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â­p Admin</h2>
            <p className="text-[#8b7668] text-xs mb-6">DÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¹ng mÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â­t khÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â©u demo bÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Âªn dÃƒÆ’Ã¢â‚¬Â Ãƒâ€šÃ‚Â°ÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â€šÂ¬Ã‚Âºi ÃƒÆ’Ã¢â‚¬Å¾ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“ÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»Ãƒâ€ Ã¢â‚¬â„¢ truy cÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â­p giao diÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡n quÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â£n trÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¹.</p>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#6a3d29] font-medium">MÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â­t khÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â©u demo</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input 
                    type="password" 
                    placeholder="NhÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â­p admin123" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    className="w-full pl-10 pr-4 py-2.5 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm"
                  />
                </div>
              </div>

              {loginError && (
                <p className="text-xs text-[#b94d3f] font-medium mt-1">
                  Sai mÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â­t khÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â©u. MÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â­t khÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â©u demo mÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â·c ÃƒÆ’Ã¢â‚¬Å¾ÃƒÂ¢Ã¢â€šÂ¬Ã‹Å“ÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¹nh lÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â  admin123
                </p>
              )}

              <button 
                onClick={handleLogin}
                className="w-full py-3 bg-[#321b12] hover:bg-[#47271b] text-white rounded-xl text-sm font-medium shadow-md transition-all mt-2"
              >
                ÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€šÃ‚ÂÃƒÆ’Ã¢â‚¬Å¾Ãƒâ€ Ã¢â‚¬â„¢ng nhÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â­p CMS
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[280px_1fr]">
      {/* Sidebar navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-[#fffdf8]/90 backdrop-blur-md border-r border-black/8 p-6 flex flex-col justify-between overflow-y-auto lg:translate-x-0 lg:static transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          {/* Brand header */}
          <div className="flex items-center gap-3 text-[#321b12] text-xl font-medium mb-8">
            <span className="w-10 h-10 rounded-xl bg-[#321b12] text-white flex items-center justify-center text-lg font-bold font-mono">A</span>
            <span>AURATEA CMS</span>
          </div>

          {/* Nav groups */}
          <nav className="space-y-6">
            {sections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1.5">
                <div className="text-[10px] uppercase tracking-widest text-[#8b7668] font-medium px-3.5 mb-2">{section}</div>
                <div className="space-y-1">
                  {navigationItems
                    .filter(item => item.section === section)
                    .map((item, idx) => {
                      const Icon = item.icon;
                      const isActive = activeView === item.id;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setActiveView(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                            isActive 
                              ? 'bg-gradient-to-r from-[#60331e] to-[#321b12] text-white shadow-md' 
                              : 'text-[#6a3d29] hover:bg-white hover:text-[#321b12]'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center ${isActive ? 'bg-white/10' : 'bg-amber-50'}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </span>
                          {item.label}
                        </button>
                      );
                    })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-4 border-t border-black/5 text-center text-[11px] text-[#8b7668]">
          Giao diÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¡n quÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚ÂºÃƒâ€šÃ‚Â£n trÃƒÆ’Ã‚Â¡Ãƒâ€šÃ‚Â»ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¹ v1.0
        </div>
      </aside>

      {/* Mobile Sidebar overlay backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Main panel viewport */}
      <main className="p-4 sm:p-6 lg:p-8 min-h-screen flex flex-col overflow-x-hidden">
        {/* Topbar panel */}
        <div className="sticky top-0 z-30 flex items-center justify-between gap-4 p-4 mb-6 bg-[#fffdf8]/85 backdrop-blur-md border border-black/8 rounded-2xl shadow-sm">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 border border-black/10 rounded-xl hover:bg-white lg:hidden text-[#321b12]"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Live global finder input */}
          <div className="hidden sm:flex items-center flex-1 max-w-[480px] relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input 
              value={globalSearch}
              onChange={e => handleGlobalSearch(e.target.value)}
              placeholder={t('topbar.searchPlaceholder')} 
              className="w-full pl-10 pr-4 py-2 border border-black/10 rounded-xl outline-none bg-white focus:border-[#c98632] transition-all text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={locale}
              onChange={e => switchLocale(e.target.value)}
              className="px-3 py-2 border border-black/10 rounded-xl outline-none bg-white text-xs text-[#321b12]"
              aria-label={t('common.language')}
            >
              <option value="vi">VI</option>
              <option value="en">EN</option>
            </select>
            <div className="h-8 w-[1px] bg-black/5 mx-1 hidden sm:block"></div>
            <div className="flex items-center gap-2.5 pl-1">
              <div className="w-9 h-9 rounded-full bg-[#321b12] text-white flex items-center justify-center text-sm font-bold">A</div>
              <div className="hidden md:block text-left leading-none">
                <div className="text-xs font-medium text-[#321b12]">{t('topbar.admin')}</div>
                <span className="text-[10px] text-[#8b7668]">{t('topbar.administrator')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* View body canvas rendered based on active view with smooth fade-in motion */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeView === 'dashboard' && (
                <DashboardView 
                  db={db} 
                  onNavigate={setActiveView} 
                  onReset={handleResetData}
                  onLogout={handleLogout}
                />
              )}
              {activeView === 'products' && (
                <ProductsView 
                  db={db} 
                  onUpdateProducts={handleUpdateProducts}
                  onToast={triggerToast}
                />
              )}
              {activeView === 'orders' && (
                <OrdersView 
                  db={db} 
                  onUpdateOrders={handleUpdateOrders}
                  onToast={triggerToast}
                />
              )}
              {activeView === 'categories' && (
                <CategoriesView 
                  db={db} 
                  onUpdateCategories={handleUpdateCategories}
                  onToast={triggerToast}
                />
              )}
              {activeView === 'toppings' && (
                <ToppingsView 
                  db={db} 
                  onUpdateToppings={handleUpdateToppings}
                  onToast={triggerToast}
                />
              )}
              {activeView === 'materials' && (
                <MaterialsView 
                  db={db} 
                  onUpdateMaterials={handleUpdateMaterials}
                  onToast={triggerToast}
                />
              )}
              {activeView === 'staff' && (
                <StaffView 
                  db={db} 
                  onUpdateStaff={handleUpdateStaff}
                  onToast={triggerToast}
                />
              )}
              {activeView === 'offers' && (
                <OffersView 
                  db={db} 
                  onUpdateOffers={handleUpdateOffers}
                  onToast={triggerToast}
                />
              )}
              {activeView === 'content' && (
                <ContentView 
                  db={db} 
                  onUpdateContent={handleUpdateContent}
                  onToast={triggerToast}
                />
              )}
              {activeView === 'media' && (
                <MediaView 
                  db={db} 
                  onUpdateMedia={handleUpdateMedia}
                  onToast={triggerToast}
                />
              )}
              {activeView === 'settings' && (
                <SettingsView 
                  db={db} 
                  onUpdateSettings={handleUpdateSettings}
                  onToast={triggerToast}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Floating alert toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-[#321b12] text-white rounded-2xl text-xs font-medium shadow-2xl flex items-center gap-2 border border-white/5"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-ping"></span>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
