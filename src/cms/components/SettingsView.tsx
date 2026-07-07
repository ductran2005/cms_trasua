import React, { useState } from 'react';

import { type AppDatabase, type SettingsState } from '../types';

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
    onToast('ÄÃ£ cáº­p nháº­t cáº¥u hÃ¬nh cá»­a hÃ ng');
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight mb-2">CÃ i Ä‘áº·t</h1>
          <p className="text-[#8b7668]">ThÃ´ng tin cá»­a hÃ ng, máº­t kháº©u demo vÃ  cáº¥u hÃ¬nh chung.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cá»­a hÃ ng settings */}
        <div className="bg-white border border-black/8 rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl mb-4 pb-2 border-b border-black/5">ThÃ´ng tin cá»­a hÃ ng</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6a3d29] font-medium">TÃªn thÆ°Æ¡ng hiá»‡u *</label>
              <input 
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6a3d29] font-medium">Äá»‹a chá»‰ cá»­a hÃ ng *</label>
              <input 
                value={shopAddress}
                onChange={e => setShopAddress(e.target.value)}
                className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#6a3d29] font-medium">Sá»‘ Ä‘iá»‡n thoáº¡i *</label>
                <input 
                  value={shopPhone}
                  onChange={e => setShopPhone(e.target.value)}
                  className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm font-mono-custom"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#6a3d29] font-medium">Email liÃªn há»‡ *</label>
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
              <label className="text-xs text-[#6a3d29] font-medium">Giá» má»Ÿ cá»­a *</label>
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
              LÆ°u cÃ i Ä‘áº·t
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
