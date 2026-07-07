import { Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';

import { uid } from '../data';
import { type AppDatabase, type MediaItem } from '../types';

interface MediaViewProps {
  db: AppDatabase;
  onUpdateMedia: (media: MediaItem[]) => void;
  onToast: (msg: string) => void;
}

export const MediaView: React.FC<MediaViewProps> = ({ db, onUpdateMedia, onToast }) => {
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formUrl, setFormUrl] = useState('');

  const handleEdit = (m: MediaItem) => {
    setFormId(m.id);
    setFormName(m.name);
    setFormUrl(m.url);
  };

  const handleClear = () => {
    setFormId('');
    setFormName('');
    setFormUrl('');
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Xác nhận xóa liên kết ảnh này khỏi thư viện?')) return;
    const next = db.media.filter(m => m.id !== id);
    onUpdateMedia(next);
    onToast('Đã xóa liên kết ảnh');
    if (formId === id) handleClear();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formUrl) return;

    const newItem: MediaItem = {
      id: formId || uid(),
      name: formName.trim(),
      url: formUrl.trim()
    };

    let nextMedia = [...db.media];
    if (formId) {
      nextMedia = nextMedia.map(m => m.id === formId ? newItem : m);
      onToast('Đã sửa thông tin ảnh');
    } else {
      nextMedia.push(newItem);
      onToast('Đã lưu ảnh mới vào thư viện');
    }

    onUpdateMedia(nextMedia);
    handleClear();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight mb-2">Thư viện ảnh</h1>
          <p className="text-[#8b7668]">Quản lý URL hình ảnh dùng cho sản phẩm và banner.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="bg-white border border-black/8 rounded-3xl p-6 lg:col-span-8 shadow-sm">
          <h2 className="text-xl mb-6">Ảnh đã lưu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {db.media.map((m, idx) => (
              <div key={idx} className="bg-amber-50/10 border border-black/5 rounded-2xl p-3 flex flex-col gap-3 group relative hover:shadow-md transition-all">
                <div className="w-full h-36 rounded-xl overflow-hidden border border-black/5 bg-gray-100">
                  <img 
                    src={m.url} 
                    alt={m.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <div className="font-medium text-sm text-[#321b12] truncate" title={m.name}>{m.name}</div>
                  <div className="text-[10px] text-gray-400 font-mono-custom mt-1 truncate" title={m.url}>{m.url}</div>
                </div>
                <div className="flex items-center gap-1 mt-auto border-t border-black/5 pt-2">
                  <button 
                    onClick={() => handleEdit(m)}
                    className="text-xs px-2.5 py-1 border border-black/10 rounded-lg hover:bg-white text-[#321b12] transition-all"
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleDelete(m.id)}
                    className="text-xs px-2.5 py-1 border border-red-200 rounded-lg hover:bg-red-50 text-red-600 transition-all flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Xóa
                  </button>
                </div>
              </div>
            ))}
            {db.media.length === 0 && (
              <div className="col-span-full py-12 text-center text-[#8b7668] text-xs">
                Chưa lưu liên kết hình ảnh nào
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-black/8 rounded-3xl p-6 lg:col-span-4 shadow-sm self-start">
          <h2 className="text-xl mb-4 pb-3 border-b border-black/5">Thêm ảnh</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6a3d29] font-medium">Tên mô tả ảnh *</label>
              <input 
                value={formName}
                onChange={e => setFormName(e.target.value)}
                placeholder="Trà ô long đào" 
                className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm"
                required
              />
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6a3d29] font-medium">URL ảnh *</label>
              <input 
                value={formUrl}
                onChange={e => setFormUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..." 
                className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full py-2.5 bg-[#daa94f] text-white rounded-xl hover:opacity-95 transition-all text-sm font-medium shadow-sm flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Lưu ảnh
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
