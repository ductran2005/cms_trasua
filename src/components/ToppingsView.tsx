import React, { useState } from 'react';
import { AppDatabase, Topping } from '../types';
import { uid } from '../data';

interface ToppingsViewProps {
  db: AppDatabase;
  onUpdateToppings: (toppings: Topping[]) => void;
  onToast: (msg: string) => void;
}

export const ToppingsView: React.FC<ToppingsViewProps> = ({ db, onUpdateToppings, onToast }) => {
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formActive, setFormActive] = useState('true');

  const formatMoney = (n: number) => {
    return n.toLocaleString('vi-VN') + 'đ';
  };

  const handleEdit = (t: Topping) => {
    setFormId(t.id);
    setFormName(t.name);
    setFormPrice(t.price.toString());
    setFormActive(t.active ? 'true' : 'false');
  };

  const handleClear = () => {
    setFormId('');
    setFormName('');
    setFormPrice('');
    setFormActive('true');
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Xác nhận xóa topping này?')) return;
    const next = db.toppings.filter(t => t.id !== id);
    onUpdateToppings(next);
    onToast('Đã xóa topping');
    if (formId === id) handleClear();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice) return;

    const price = parseFloat(formPrice);
    if (isNaN(price)) {
      alert('Vui lòng điền giá hợp lệ.');
      return;
    }

    const newTopping: Topping = {
      id: formId || uid(),
      name: formName.trim(),
      price,
      active: formActive === 'true'
    };

    let nextToppings = [...db.toppings];
    if (formId) {
      nextToppings = nextToppings.map(t => t.id === formId ? newTopping : t);
      onToast('Đã cập nhật topping');
    } else {
      nextToppings.push(newTopping);
      onToast('Đã thêm topping mới');
    }

    onUpdateToppings(nextToppings);
    handleClear();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight mb-2">Topping</h1>
          <p className="text-[#8b7668]">Quản lý topping, giá thêm và trạng thái bán.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="bg-white border border-black/8 rounded-3xl p-6 lg:col-span-8 shadow-sm">
          <h2 className="text-xl mb-4">Danh sách topping</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/5 bg-[#fff8ef]">
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">Tên Topping</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">Giá thêm</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">Trạng thái</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668] text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-sm">
                {db.toppings.map((t, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/10 transition-all">
                    <td className="p-3 font-medium">{t.name}</td>
                    <td className="p-3 font-mono-custom text-xs">{formatMoney(t.price)}</td>
                    <td className="p-3">
                      <span className={`inline-block text-[11px] px-2.5 py-1 rounded-full ${t.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {t.active ? 'Đang bán' : 'Ẩn'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => handleEdit(t)}
                          className="px-2.5 py-1 text-xs border border-black/10 rounded-lg hover:bg-[#fff8ef] transition-all"
                        >
                          Sửa
                        </button>
                        <button 
                          onClick={() => handleDelete(t.id)}
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
          <h2 className="text-xl mb-4 pb-3 border-b border-black/5">Thêm / sửa topping</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6a3d29] font-medium">Tên topping *</label>
              <input 
                value={formName}
                onChange={e => setFormName(e.target.value)}
                placeholder="Trân châu đường đen" 
                className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6a3d29] font-medium">Giá thêm (đ) *</label>
              <input 
                type="number"
                value={formPrice}
                onChange={e => setFormPrice(e.target.value)}
                placeholder="7000" 
                className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm font-mono-custom"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6a3d29] font-medium">Trạng thái bán</label>
              <select 
                value={formActive}
                onChange={e => setFormActive(e.target.value)}
                className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none bg-white text-sm"
              >
                <option value="true">Đang bán</option>
                <option value="false">Ẩn</option>
              </select>
            </div>
            <button 
              type="submit"
              className="w-full py-2.5 bg-[#daa94f] text-white rounded-xl hover:opacity-95 transition-all text-sm font-medium shadow-sm"
            >
              Lưu topping
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
