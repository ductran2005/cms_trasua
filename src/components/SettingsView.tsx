import React, { useState } from 'react';
import { AppDatabase, SettingsState } from '../types';

interface SettingsViewProps {
  db: AppDatabase;
  onUpdateSettings: (settings: SettingsState) => void;
  onToast: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ db, onUpdateSettings, onToast }) => {
  const [shopName, setShopName] = useState(db.settings.shopName);
  const [shopAddress, setShopAddress] = useState(db.settings.shopAddress);
  const [shopPhone, setShopPhone] = useState(db.settings.shopPhone);
  const [shopEmail, setShopEmail] = useState(db.settings.shopEmail);
  const [shopHours, setShopHours] = useState(db.settings.shopHours);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextSettings: SettingsState = {
      shopName: shopName.trim(),
      shopAddress: shopAddress.trim(),
      shopPhone: shopPhone.trim(),
      shopEmail: shopEmail.trim(),
      shopHours: shopHours.trim()
    };
    onUpdateSettings(nextSettings);
    onToast('Đã cập nhật cấu hình cửa hàng');
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight mb-2">Cài đặt</h1>
          <p className="text-[#8b7668]">Thông tin cửa hàng, mật khẩu demo và cấu hình chung.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cửa hàng settings */}
        <div className="bg-white border border-black/8 rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl mb-4 pb-2 border-b border-black/5">Thông tin cửa hàng</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6a3d29] font-medium">Tên thương hiệu *</label>
              <input 
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6a3d29] font-medium">Địa chỉ cửa hàng *</label>
              <input 
                value={shopAddress}
                onChange={e => setShopAddress(e.target.value)}
                className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#6a3d29] font-medium">Số điện thoại *</label>
                <input 
                  value={shopPhone}
                  onChange={e => setShopPhone(e.target.value)}
                  className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm font-mono-custom"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#6a3d29] font-medium">Email liên hệ *</label>
                <input 
                  type="email"
                  value={shopEmail}
                  onChange={e => setShopEmail(e.target.value)}
                  className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6a3d29] font-medium">Giờ mở cửa *</label>
              <input 
                value={shopHours}
                onChange={e => setShopHours(e.target.value)}
                className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm font-mono-custom"
                required
              />
            </div>

            <button 
              type="submit"
              className="py-2 px-6 bg-[#daa94f] text-white rounded-xl hover:opacity-95 transition-all text-sm font-medium shadow-sm"
            >
              Lưu cài đặt
            </button>
          </form>
        </div>

        {/* Developer Notes / Production details */}
        <div className="bg-white border border-black/8 rounded-3xl p-6 shadow-sm self-start space-y-4">
          <h2 className="text-xl pb-2 border-b border-black/5">Ghi chú production</h2>
          <p className="text-[#8b7668] text-xs leading-relaxed">
            Bản này là CMS giao diện + CRUD demo bằng localStorage. Khi triển khai thật, thay phần lưu dữ liệu bằng MongoDB API và auth admin.
          </p>
          <div className="bg-[#271811] text-[#ffe6b5] p-4 rounded-2xl overflow-x-auto text-xs font-mono-custom space-y-2 leading-relaxed">
            <div># Cấu hình biến môi trường production</div>
            <div>ADMIN_PASSWORD=your_password</div>
            <div>MONGODB_URI=mongodb+srv://...</div>
            <div>NEXT_PUBLIC_API_URL=/api</div>
          </div>
        </div>
      </div>
    </div>
  );
};
