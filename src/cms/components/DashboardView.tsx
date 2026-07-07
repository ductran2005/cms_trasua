import { DollarSign, ShoppingBag, Layers, Award } from 'lucide-react';
import React from 'react';

import { type AppDatabase } from '../types';

interface DashboardViewProps {
  db: AppDatabase;
  onNavigate: (view: string) => void;
  onReset: () => void;
  onLogout: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ db, onNavigate, onReset, onLogout }) => {
  const formatMoney = (n: number) => {
    return n.toLocaleString('vi-VN') + 'đ';
  };

  const revenueToday = db.orders.reduce((sum, o) => sum + o.total, 0);
  const ordersToday = db.orders.length;
  const productsCount = db.products.filter(p => p.active).length;
  const bestSeller = db.products[0]?.name || "Trà sữa";

  const chartData = [
    { label: 'T2', val: 1.0 },
    { label: 'T3', val: 1.7 },
    { label: 'T4', val: 2.4 },
    { label: 'T5', val: 2.45 },
    { label: 'T6', val: 2.6 },
    { label: 'T7', val: 3.4 },
    { label: 'CN', val: 1.6 }
  ];

  const getBadgeClass = (status: string) => {
    switch (status) {
      case 'Hoàn thành': return 'bg-[#e8f5df] text-[#557e3c]';
      case 'Đang giao': return 'bg-[#e7f0fb] text-[#477eb8]';
      case 'Đang pha': return 'bg-[#fff3d5] text-[#b57620]';
      case 'Đã hủy': return 'bg-[#fff0ee] text-[#b94d3f]';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight mb-2">Dashboard</h1>
          <p className="text-[#8b7668]">Quản trị menu, đơn hàng và nội dung landing page AURATEA.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button 
            onClick={onReset}
            className="px-4 py-2 border border-black/10 rounded-xl hover:bg-white transition-all text-xs"
          >
            Reset dữ liệu mẫu
          </button>
          <button 
            onClick={onLogout}
            className="px-4 py-2 bg-[#321b12] text-white rounded-xl hover:opacity-90 transition-all text-xs"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1 */}
        <div className="bg-white border border-black/8 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#fffdf8] flex items-center justify-center text-[#c98632] border border-black/5">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[#8b7668] text-xs">Doanh thu hôm nay</div>
            <div className="text-2xl mt-1">{formatMoney(revenueToday)}</div>
            <div className="text-[#4c8a3f] text-xs mt-1">↑ 18% so với hôm qua</div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-black/8 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#fffdf8] flex items-center justify-center text-[#c98632] border border-black/5">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[#8b7668] text-xs">Đơn hôm nay</div>
            <div className="text-2xl mt-1">{ordersToday}</div>
            <div className="text-[#4c8a3f] text-xs mt-1">↑ 12% so với hôm qua</div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-black/8 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#fffdf8] flex items-center justify-center text-[#c98632] border border-black/5">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[#8b7668] text-xs">Sản phẩm</div>
            <div className="text-2xl mt-1">{productsCount}</div>
            <div className="text-[#4c8a3f] text-xs mt-1">Đang hoạt động</div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-black/8 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-[#fffdf8] flex items-center justify-center text-[#c98632] border border-black/5">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[#8b7668] text-xs">Best Seller</div>
            <div className="text-lg mt-1 truncate max-w-[150px]" title={bestSeller}>{bestSeller}</div>
            <div className="text-[#4c8a3f] text-xs mt-1">Yêu thích nhất</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Doanh thu tuần */}
        <div className="bg-white border border-black/8 rounded-3xl p-6 lg:col-span-7 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl">Doanh thu tuần này</h2>
            <span className="text-xs px-2.5 py-1 bg-[#fffdf8] border border-black/5 rounded-lg text-[#8b7668]">7 ngày qua</span>
          </div>
          <div className="h-[240px] flex items-end gap-3 px-2 pt-6 pb-2 border border-black/5 rounded-2xl bg-gradient-to-b from-white to-[#fff8ef]">
            {chartData.map((d, idx) => (
              <div key={idx} className="flex-1 flex flex-col justify-end gap-2 h-full items-center">
                <div 
                  className="w-full rounded-t-xl bg-gradient-to-t from-[#c98632] to-[#daa94f] shadow-sm hover:brightness-105 transition-all"
                  style={{ height: `${(d.val / 3.4) * 100}%` }}
                />
                <div className="text-[11px] text-[#8b7668]">{d.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Đơn hàng gần đây */}
        <div className="bg-white border border-black/8 rounded-3xl p-6 lg:col-span-5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl">Đơn hàng gần đây</h2>
            <button 
              onClick={() => onNavigate('orders')}
              className="text-xs px-2.5 py-1 bg-[#fffdf8] border border-black/5 rounded-lg text-[#8b7668] hover:bg-amber-50 transition-all"
            >
              Xem tất cả
            </button>
          </div>
          <div className="space-y-3">
            {db.orders.slice(0, 5).map((o, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-black/5 rounded-xl bg-amber-50/10 hover:bg-amber-50/30 transition-all">
                <div>
                  <div className="text-sm font-medium text-[#321b12]">{o.id} · {o.customer}</div>
                  <div className="text-xs text-[#8b7668] mt-0.5">{o.time} · {o.items} · {formatMoney(o.total)}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] tracking-wide ${getBadgeClass(o.status)}`}>
                  {o.status}
                </span>
              </div>
            ))}
            {db.orders.length === 0 && (
              <div className="text-center py-8 text-[#8b7668] text-xs">Không có đơn hàng nào</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
