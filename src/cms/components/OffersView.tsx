import React, { useState } from 'react';

import { uid } from '../data';
import { type AppDatabase, type Offer } from '../types';

interface OffersViewProps {
  db: AppDatabase;
  onUpdateOffers: (offers: Offer[]) => void;
  onToast: (msg: string) => void;
}

export const OffersView: React.FC<OffersViewProps> = ({ db, onUpdateOffers, onToast }) => {
  const [formId, setFormId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formStart, setFormStart] = useState('');
  const [formEnd, setFormEnd] = useState('');
  const [formActive, setFormActive] = useState('true');

  const handleEdit = (o: Offer) => {
    setFormId(o.id);
    setFormTitle(o.title);
    setFormDesc(o.desc);
    setFormStart(o.start);
    setFormEnd(o.end);
    setFormActive(o.active ? 'true' : 'false');
  };

  const handleClear = () => {
    setFormId('');
    setFormTitle('');
    setFormDesc('');
    setFormStart('');
    setFormEnd('');
    setFormActive('true');
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Xác nhận xóa ưu đãi này?')) return;
    const next = db.offers.filter(o => o.id !== id);
    onUpdateOffers(next);
    onToast('Đã xóa ưu đãi');
    if (formId === id) handleClear();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDesc) return;

    const newOffer: Offer = {
      id: formId || uid(),
      title: formTitle.trim(),
      desc: formDesc.trim(),
      start: formStart,
      end: formEnd,
      active: formActive === 'true'
    };

    let nextOffers = [...db.offers];
    if (formId) {
      nextOffers = nextOffers.map(o => o.id === formId ? newOffer : o);
      onToast('Đã cập nhật ưu đãi');
    } else {
      nextOffers.push(newOffer);
      onToast('Đã thêm ưu đãi mới');
    }

    onUpdateOffers(nextOffers);
    handleClear();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight mb-2">Ưu đãi</h1>
          <p className="text-[#8b7668]">Quản lý khuyến mãi hiển thị trên landing page.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="bg-white border border-black/8 rounded-3xl p-6 lg:col-span-8 shadow-sm">
          <h2 className="text-xl mb-4">Danh sách ưu đãi</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/5 bg-[#fff8ef]">
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">Tiêu đề ưu đãi</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">Mô tả</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">Bắt đầu / Kết thúc</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">Trạng thái</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668] text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-sm">
                {db.offers.map((o, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/10 transition-all">
                    <td className="p-3 font-medium text-[#321b12]">{o.title}</td>
                    <td className="p-3 text-[#8b7668] max-w-xs truncate" title={o.desc}>{o.desc}</td>
                    <td className="p-3 font-mono-custom text-xs text-gray-500">
                      {o.start || '-'} / {o.end || '-'}
                    </td>
                    <td className="p-3">
                      <span className={`inline-block text-[11px] px-2.5 py-1 rounded-full ${o.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {o.active ? 'Đang chạy' : 'Tắt'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => handleEdit(o)}
                          className="px-2.5 py-1 text-xs border border-black/10 rounded-lg hover:bg-[#fff8ef] transition-all"
                        >
                          Sửa
                        </button>
                        <button 
                          onClick={() => handleDelete(o.id)}
                          className="px-2.5 py-1 text-xs border border-red-200 text-red-600 bg-red-50/20 rounded-lg hover:bg-red-50 transition-all"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-black/8 rounded-3xl p-6 lg:col-span-4 shadow-sm self-start">
          <h2 className="text-xl mb-4 pb-3 border-b border-black/5">Thêm / sửa ưu đãi</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6a3d29] font-medium">Tiêu đề *</label>
              <input 
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                placeholder="Mua 2 ly giảm 15%" 
                className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm"
                required
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6a3d29] font-medium">Mô tả chi tiết *</label>
              <textarea 
                value={formDesc}
                onChange={e => setFormDesc(e.target.value)}
                placeholder="Áp dụng khi đặt qua ứng dụng..." 
                className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm min-h-[90px] resize-y"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#6a3d29] font-medium">Ngày bắt đầu</label>
                <input 
                  type="date"
                  value={formStart}
                  onChange={e => setFormStart(e.target.value)}
                  className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm font-mono-custom"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#6a3d29] font-medium">Ngày kết thúc</label>
                <input 
                  type="date"
                  value={formEnd}
                  onChange={e => setFormEnd(e.target.value)}
                  className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm font-mono-custom"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6a3d29] font-medium">Trạng thái chạy</label>
              <select 
                value={formActive}
                onChange={e => setFormActive(e.target.value)}
                className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none bg-white text-sm"
              >
                <option value="true">Đang chạy</option>
                <option value="false">Tắt ưu đãi</option>
              </select>
            </div>

            <button 
              type="submit"
              className="w-full py-2.5 bg-[#daa94f] text-white rounded-xl hover:opacity-95 transition-all text-sm font-medium shadow-sm"
            >
              Lưu ưu đãi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
