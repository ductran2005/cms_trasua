import { Search, RotateCcw, Sparkles } from 'lucide-react';
import React, { useState } from 'react';

import { uid } from '../data';
import { type AppDatabase, type Product } from '../types';

interface ProductsViewProps {
  db: AppDatabase;
  onUpdateProducts: (products: Product[]) => void;
  onToast: (msg: string) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ db, onUpdateProducts, onToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Form State
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState(db.categories[0]?.name || '');
  const [formTag, setFormTag] = useState('');
  const [formPriceM, setFormPriceM] = useState('');
  const [formPriceL, setFormPriceL] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formActive, setFormActive] = useState('true');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const formatMoney = (n: number) => {
    return n.toLocaleString('vi-VN') + 'đ';
  };

  const handleEdit = (p: Product) => {
    setFormId(p.id);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormTag(p.tag);
    setFormPriceM(p.priceM.toString());
    setFormPriceL(p.priceL.toString());
    setFormImage(p.image);
    setFormDesc(p.desc);
    setFormActive(p.active ? 'true' : 'false');
    setIsFormOpen(true);
  };

  const handleClear = () => {
    setFormId('');
    setFormName('');
    setFormCategory(db.categories[0]?.name || '');
    setFormTag('');
    setFormPriceM('');
    setFormPriceL('');
    setFormImage('');
    setFormDesc('');
    setFormActive('true');
  };

  const handleClose = () => {
    setIsFormOpen(false);
    handleClear();
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Xác nhận xóa sản phẩm này?')) return;
    const next = db.products.filter(p => p.id !== id);
    onUpdateProducts(next);
    onToast('Đã xóa sản phẩm');
    if (formId === id) handleClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPriceM || !formPriceL || !formImage || !formDesc) {
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    const priceM = parseFloat(formPriceM);
    const priceL = parseFloat(formPriceL);

    if (isNaN(priceM) || isNaN(priceL)) {
      alert('Giá sản phẩm phải là số hợp lệ.');
      return;
    }

    const newProduct: Product = {
      id: formId || uid(),
      name: formName.trim(),
      category: formCategory,
      tag: formTag.trim(),
      priceM,
      priceL,
      image: formImage.trim(),
      desc: formDesc.trim(),
      active: formActive === 'true'
    };

    let nextProducts = [...db.products];
    if (formId) {
      nextProducts = nextProducts.map(p => p.id === formId ? newProduct : p);
      onToast('Đã cập nhật sản phẩm');
    } else {
      nextProducts.push(newProduct);
      onToast('Đã thêm sản phẩm mới');
    }

    onUpdateProducts(nextProducts);
    handleClose();
  };

  const filteredProducts = db.products.filter(p => {
    const matchSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tag.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter ? p.category === categoryFilter : true;
    return matchSearch && matchCat;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight mb-2">Sản phẩm</h1>
          <p className="text-[#8b7668]">Thêm, sửa, xóa trà sữa và đồng bộ dữ liệu lên landing page.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              handleClear();
              setIsFormOpen(true);
              setTimeout(() => {
                const input = document.getElementById('productFormName');
                input?.focus();
              }, 100);
            }}
            className="px-4 py-2 bg-[#daa94f] text-white rounded-xl hover:opacity-95 transition-all text-xs shadow-sm flex items-center gap-1 font-medium"
          >
            + Thêm sản phẩm
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table list column */}
        <div className={`bg-white border border-black/8 rounded-3xl p-6 shadow-sm transition-all duration-300 ${isFormOpen ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl">Danh sách sản phẩm</h2>
            {isFormOpen && (
              <button 
                onClick={handleClear}
                className="text-xs px-2.5 py-1.5 border border-black/10 rounded-xl hover:bg-amber-50/20 transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" /> Làm mới form
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Tìm sản phẩm..." 
                className="w-full pl-10 pr-4 py-2 border border-black/10 rounded-xl outline-none bg-amber-50/5 focus:border-[#c98632] transition-all text-sm"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-black/10 rounded-xl outline-none bg-white text-sm"
            >
              <option value="">Tất cả danh mục</option>
              {db.categories.map((c, i) => (
                <option key={i} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-black/5 bg-[#fff8ef]">
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">Ảnh</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">Tên món</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">Danh mục</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">Giá</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">Tag</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">Trạng thái</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668] text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-sm">
                {filteredProducts.map((p, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/10 transition-all">
                    <td className="p-3">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-12 h-12 object-cover rounded-xl border border-black/5"
                        referrerPolicy="no-referrer"
                      />
                    </td>
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3 text-[#8b7668]">{p.category}</td>
                    <td className="p-3 font-mono-custom text-xs">
                      {formatMoney(p.priceM)} - {formatMoney(p.priceL)}
                    </td>
                    <td className="p-3">
                      {p.tag ? (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          <Sparkles className="w-2.5 h-2.5" /> {p.tag}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="p-3">
                      <span className={`inline-block text-[11px] px-2.5 py-1 rounded-full ${p.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {p.active ? 'Đang bán' : 'Ẩn'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => handleEdit(p)}
                          className="px-2.5 py-1 text-xs border border-black/10 rounded-lg hover:bg-[#fff8ef] transition-all"
                        >
                          Sửa
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="px-2.5 py-1 text-xs border border-red-200 text-red-600 bg-red-50/20 rounded-lg hover:bg-red-50 transition-all"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-[#8b7668] text-xs">
                      Không tìm thấy sản phẩm nào trùng khớp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form panel column */}
        {isFormOpen && (
          <div id="productFormStart" className="bg-white border border-black/8 rounded-3xl p-6 lg:col-span-4 shadow-sm self-start animate-fade-in">
            <div className="flex items-center justify-between mb-4 border-b border-black/5 pb-3">
              <h2 className="text-xl">{formId ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
              <div className="flex items-center gap-2">
                <button 
                  type="button" 
                  onClick={handleClear} 
                  className="text-xs text-[#8b7668] hover:underline"
                >
                  Nhập lại
                </button>
                <span className="text-gray-300">|</span>
                <button 
                  type="button" 
                  onClick={handleClose} 
                  className="text-xs text-red-600 hover:underline font-medium"
                >
                  Đóng
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label id="productFormNameLabel" htmlFor="productFormName" className="text-xs text-[#6a3d29] font-medium">Tên món *</label>
                <input 
                  id="productFormName"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="Trà sữa đường đen" 
                  className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[#6a3d29] font-medium">Danh mục *</label>
                  <select 
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none bg-white text-sm"
                    required
                  >
                    {db.categories.map((c, i) => (
                      <option key={i} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[#6a3d29] font-medium">Tag (ví dụ: Bán chạy)</label>
                  <input 
                    value={formTag}
                    onChange={e => setFormTag(e.target.value)}
                    placeholder="Bán chạy" 
                    className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[#6a3d29] font-medium">Giá size M (đ) *</label>
                  <input 
                    type="number"
                    value={formPriceM}
                    onChange={e => setFormPriceM(e.target.value)}
                    placeholder="39000" 
                    className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm font-mono-custom"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[#6a3d29] font-medium">Giá size L (đ) *</label>
                  <input 
                    type="number"
                    value={formPriceL}
                    onChange={e => setFormPriceL(e.target.value)}
                    placeholder="49000" 
                    className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm font-mono-custom"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#6a3d29] font-medium">URL hình ảnh *</label>
                <input 
                  value={formImage}
                  onChange={e => setFormImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..." 
                  className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#6a3d29] font-medium">Mô tả chi tiết *</label>
                <textarea 
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                  placeholder="Trà sữa béo thơm, nhiều trân châu ngọt..." 
                  className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm min-h-[90px] resize-y"
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
                  <option value="false">Ẩn (Ngừng kinh doanh)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button 
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2.5 border border-black/10 text-gray-700 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="w-full py-2.5 bg-[#daa94f] text-white rounded-xl hover:opacity-95 transition-all text-sm font-medium shadow-sm"
                >
                  Lưu sản phẩm
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
