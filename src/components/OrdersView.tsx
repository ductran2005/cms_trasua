import React, { useState } from 'react';
import { AppDatabase, Order } from '../types';
import { Search, ShoppingBag, Eye, HelpCircle } from 'lucide-react';

interface OrdersViewProps {
  db: AppDatabase;
  onUpdateOrders: (orders: Order[]) => void;
  onToast: (msg: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ db, onUpdateOrders, onToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const formatMoney = (n: number) => {
    return n.toLocaleString('vi-VN') + 'đ';
  };

  const getBadgeClass = (status: string) => {
    switch (status) {
      case 'Hoàn thành': return 'bg-green-100 text-green-800';
      case 'Đang giao': return 'bg-blue-100 text-blue-800';
      case 'Đang pha': return 'bg-amber-100 text-amber-800';
      case 'Đã hủy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateStatus = (id: string, nextStatus: string) => {
    const next = db.orders.map(o => o.id === id ? { ...o, status: nextStatus } : o);
    onUpdateOrders(next);
    onToast(`Đã chuyển đơn sang: ${nextStatus}`);
  };

  const filteredOrders = db.orders.filter(o => {
    const matchSearch = 
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.items.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter ? o.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight mb-2">Đơn hàng</h1>
          <p className="text-[#8b7668]">Quản lý trạng thái đơn: đang pha, đang giao, hoàn thành, hủy.</p>
        </div>
      </div>

      <div className="bg-white border border-black/8 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Tìm mã đơn, tên khách hàng hoặc tên món..." 
              className="w-full pl-10 pr-4 py-2 border border-black/10 rounded-xl outline-none bg-amber-50/5 focus:border-[#c98632] transition-all text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-black/10 rounded-xl outline-none bg-white text-sm min-w-[180px]"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="Đang pha">Đang pha</option>
            <option value="Đang giao">Đang giao</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-black/5 bg-[#fff8ef]">
                <th className="p-3.5 text-[11px] uppercase tracking-wider text-[#8b7668]">Mã đơn</th>
                <th className="p-3.5 text-[11px] uppercase tracking-wider text-[#8b7668]">Khách hàng</th>
                <th className="p-3.5 text-[11px] uppercase tracking-wider text-[#8b7668]">Chi tiết món</th>
                <th className="p-3.5 text-[11px] uppercase tracking-wider text-[#8b7668]">Tổng tiền</th>
                <th className="p-3.5 text-[11px] uppercase tracking-wider text-[#8b7668]">Thời gian</th>
                <th className="p-3.5 text-[11px] uppercase tracking-wider text-[#8b7668]">Trạng thái</th>
                <th className="p-3.5 text-[11px] uppercase tracking-wider text-[#8b7668] text-right">Chuyển trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 text-sm">
              {filteredOrders.map((o, idx) => (
                <tr key={idx} className="hover:bg-amber-50/10 transition-all">
                  <td className="p-3.5 font-mono-custom text-xs text-amber-900">{o.id}</td>
                  <td className="p-3.5 font-medium">{o.customer}</td>
                  <td className="p-3.5 text-[#6a3d29]">{o.items}</td>
                  <td className="p-3.5 font-mono-custom text-xs">{formatMoney(o.total)}</td>
                  <td className="p-3.5 text-[#8b7668]">{o.time}</td>
                  <td className="p-3.5">
                    <span className={`inline-block text-[11px] px-2.5 py-1 rounded-full ${getBadgeClass(o.status)}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handleUpdateStatus(o.id, 'Đang pha')}
                        disabled={o.status === 'Đang pha'}
                        className={`px-2 py-1 text-[11px] rounded-lg border transition-all ${
                          o.status === 'Đang pha' 
                            ? 'bg-amber-50 border-amber-200 text-amber-500 cursor-not-allowed' 
                            : 'border-black/10 hover:bg-[#fff8ef]'
                        }`}
                      >
                        Đang pha
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(o.id, 'Đang giao')}
                        disabled={o.status === 'Đang giao'}
                        className={`px-2 py-1 text-[11px] rounded-lg border transition-all ${
                          o.status === 'Đang giao' 
                            ? 'bg-blue-50 border-blue-200 text-blue-500 cursor-not-allowed' 
                            : 'border-black/10 hover:bg-[#fff8ef]'
                        }`}
                      >
                        Giao
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(o.id, 'Hoàn thành')}
                        disabled={o.status === 'Hoàn thành'}
                        className={`px-2 py-1 text-[11px] rounded-lg border transition-all ${
                          o.status === 'Hoàn thành' 
                            ? 'bg-green-50 border-green-200 text-green-500 cursor-not-allowed' 
                            : 'border-black/10 hover:bg-[#fff8ef] text-green-600'
                        }`}
                      >
                        Xong
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(o.id, 'Đã hủy')}
                        disabled={o.status === 'Đã hủy'}
                        className={`px-2 py-1 text-[11px] rounded-lg border transition-all ${
                          o.status === 'Đã hủy' 
                            ? 'bg-red-50 border-red-200 text-red-500 cursor-not-allowed' 
                            : 'border-black/10 hover:bg-[#fff8ef] text-red-600'
                        }`}
                      >
                        Hủy
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#8b7668] text-xs">
                    Không tìm thấy đơn hàng nào trùng khớp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
