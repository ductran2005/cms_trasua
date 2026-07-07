import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Receipt, 
  Coffee, 
  FolderOpen, 
  Sparkles, 
  Warehouse, 
  Users, 
  Gift, 
  FileEdit, 
  Image as ImageIcon, 
  Settings, 
  Link2, 
  Menu, 
  Search, 
  Download, 
  Lock,
  Compass
} from 'lucide-react';
import { AppDatabase, Category, Product, Topping, Material, Staff, Order, Offer, MediaItem, ContentState, SettingsState } from './types';
import { loadDatabase, saveDatabase, initialSampleData } from './data';

// Import Views
import { DashboardView } from './components/DashboardView';
import { ProductsView } from './components/ProductsView';
import { OrdersView } from './components/OrdersView';
import { CategoriesView } from './components/CategoriesView';
import { ToppingsView } from './components/ToppingsView';
import { MaterialsView } from './components/MaterialsView';
import { StaffView } from './components/StaffView';
import { OffersView } from './components/OffersView';
import { ContentView } from './components/ContentView';
import { MediaView } from './components/MediaView';
import { SettingsView } from './components/SettingsView';
import { APIView } from './components/APIView';

export default function App() {
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
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsLoggedIn(true);
      setLoginError(false);
      localStorage.setItem('auratea_admin_session', '1');
      triggerToast('Đăng nhập thành công');
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('auratea_admin_session');
  };

  const updateDatabase = (nextDb: AppDatabase) => {
    setDb(nextDb);
    saveDatabase(nextDb);
  };

  // Specific updaters
  const handleUpdateProducts = (products: Product[]) => {
    updateDatabase({ ...db, products });
  };

  const handleUpdateOrders = (orders: Order[]) => {
    updateDatabase({ ...db, orders });
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
    if (window.confirm('Reset toàn bộ dữ liệu về trạng thái mẫu?')) {
      updateDatabase(JSON.parse(JSON.stringify(initialSampleData)));
      triggerToast('Đã khôi phục dữ liệu mẫu');
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "auratea-cms-data.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast('Đã tải xuống file JSON');
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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Tổng quan' },
    { id: 'orders', label: 'Đơn hàng', icon: Receipt, section: 'Tổng quan' },
    
    { id: 'products', label: 'Sản phẩm', icon: Coffee, section: 'Quản lý menu' },
    { id: 'categories', label: 'Danh mục', icon: FolderOpen, section: 'Quản lý menu' },
    { id: 'toppings', label: 'Topping', icon: Sparkles, section: 'Quản lý menu' },
    
    { id: 'materials', label: 'Nguyên vật liệu', icon: Warehouse, section: 'Vận hành' },
    { id: 'staff', label: 'Nhân viên', icon: Users, section: 'Vận hành' },
    
    { id: 'offers', label: 'Ưu đãi', icon: Gift, section: 'Nội dung' },
    { id: 'content', label: 'Nội dung trang chủ', icon: FileEdit, section: 'Nội dung' },
    { id: 'media', label: 'Thư viện ảnh', icon: ImageIcon, section: 'Nội dung' },
    
    { id: 'settings', label: 'Cài đặt', icon: Settings, section: 'Hệ thống' },
    { id: 'api', label: 'Endpoint MongoDB', icon: Link2, section: 'Hệ thống' },
  ];

  // Group items by section
  const sections = ['Tổng quan', 'Quản lý menu', 'Vận hành', 'Nội dung', 'Hệ thống'];

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
            <h1 className="text-5xl font-light tracking-tight text-white leading-none">Quản trị trà sữa gọn, đẹp và thực tế.</h1>
            <p className="text-white/70 text-sm leading-relaxed">
              Hệ thống quản trị (CMS) dành riêng cho landing page trà sữa AURATEA: quản lý sản phẩm, topping, nguyên vật liệu, nhân viên, ưu đãi và nội dung trang chủ.
            </p>
          </div>

          <div className="text-xs text-white/40">© 2026 AURATEA. All rights reserved.</div>
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

            <h2 className="text-2xl font-light text-[#321b12] mb-1">Đăng nhập Admin</h2>
            <p className="text-[#8b7668] text-xs mb-6">Dùng mật khẩu demo bên dưới để truy cập giao diện quản trị.</p>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#6a3d29] font-medium">Mật khẩu demo</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input 
                    type="password" 
                    placeholder="Nhập admin123" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    className="w-full pl-10 pr-4 py-2.5 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm"
                  />
                </div>
              </div>

              {loginError && (
                <p className="text-xs text-[#b94d3f] font-medium mt-1">
                  Sai mật khẩu. Mật khẩu demo mặc định là admin123
                </p>
              )}

              <button 
                onClick={handleLogin}
                className="w-full py-3 bg-[#321b12] hover:bg-[#47271b] text-white rounded-xl text-sm font-medium shadow-md transition-all mt-2"
              >
                Đăng nhập CMS
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
          Giao diện quản trị v1.0
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
              placeholder="Tìm sản phẩm, nhân viên, mã đơn..." 
              className="w-full pl-10 pr-4 py-2 border border-black/10 rounded-xl outline-none bg-white focus:border-[#c98632] transition-all text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleExportJSON}
              className="px-3.5 py-2 border border-black/10 rounded-xl hover:bg-white transition-all text-xs text-[#321b12] flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export JSON
            </button>
            <button 
              onClick={() => {
                setActiveView('products');
                setTimeout(() => {
                  const input = document.getElementById('productFormName');
                  input?.focus();
                }, 200);
              }}
              className="px-3.5 py-2 bg-[#daa94f] text-white rounded-xl hover:opacity-95 transition-all text-xs shadow-xs"
            >
              + Thêm nhanh
            </button>
            <div className="h-8 w-[1px] bg-black/5 mx-1 hidden sm:block"></div>
            <div className="flex items-center gap-2.5 pl-1">
              <div className="w-9 h-9 rounded-full bg-[#321b12] text-white flex items-center justify-center text-sm font-bold">A</div>
              <div className="hidden md:block text-left leading-none">
                <div className="text-xs font-medium text-[#321b12]">Admin</div>
                <span className="text-[10px] text-[#8b7668]">Quản trị viên</span>
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
              {activeView === 'api' && (
                <APIView />
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
