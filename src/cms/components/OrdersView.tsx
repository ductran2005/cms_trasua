import { Search } from 'lucide-react';
import React, { useState } from 'react';

import { uid } from '../data';
import { type AppDatabase, type Order } from '../types';

interface OrdersViewProps {
  db: AppDatabase;
  onUpdateOrders: (orders: Order[]) => Promise<void> | void;
  onToast: (msg: string) => void;
}

const ORDER_STATUSES = ['Äang pha', 'Äang giao', 'HoÃ n thÃ nh', 'ÄÃ£ há»§y'];
const NO_TOPPING = '__none__';

export const OrdersView: React.FC<OrdersViewProps> = ({ db, onUpdateOrders, onToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [customer, setCustomer] = useState('');
  const [productId, setProductId] = useState(db.products[0]?.id ?? '');
  const [size, setSize] = useState<'M' | 'L'>('M');
  const [quantity, setQuantity] = useState('1');
  const [toppingId, setToppingId] = useState(NO_TOPPING);

  const selectedProduct = db.products.find(product => product.id === productId) ?? db.products[0];
  const selectedTopping = db.toppings.find(topping => topping.id === toppingId);
  const parsedQuantity = Math.max(1, Number(quantity) || 1);
  const productPrice = selectedProduct ? (size === 'L' ? selectedProduct.priceL : selectedProduct.priceM) : 0;
  const toppingPrice = selectedTopping?.price ?? 0;
  const computedTotal = (productPrice + toppingPrice) * parsedQuantity;
  const toppingName = selectedTopping?.name ?? 'KhÃ´ng topping';
  const computedItems = selectedProduct
    ? `${selectedProduct.name} size ${size} x${parsedQuantity}${selectedTopping ? `, topping ${selectedTopping.name}` : ''}`
    : '';

  const formatMoney = (n: number) => `${n.toLocaleString('vi-VN')}Ä‘`;

  const getBadgeClass = (orderStatus: string) => {
    switch (orderStatus) {
      case 'HoÃ n thÃ nh':
      case 'HoÃƒÂ n thÃƒÂ nh':
        return 'bg-green-100 text-green-800';
      case 'Äang giao':
      case 'Ã„Âang giao':
        return 'bg-blue-100 text-blue-800';
      case 'Äang pha':
      case 'Ã„Âang pha':
        return 'bg-amber-100 text-amber-800';
      case 'ÄÃ£ há»§y':
      case 'Ã„ÂÃƒÂ£ hÃ¡Â»Â§y':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateStatus = async (id: string, nextStatus: string) => {
    const next = db.orders.map(order => (order.id === id ? { ...order, status: nextStatus } : order));
    try {
      await onUpdateOrders(next);
      onToast(`ÄÃ£ lÆ°u tráº¡ng thÃ¡i "${nextStatus}" vÃ o MongoDB`);
    } catch {
      onToast('KhÃ´ng thá»ƒ lÆ°u tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng vÃ o MongoDB');
    }
  };

  const clearForm = () => {
    setCustomer('');
    setProductId(db.products[0]?.id ?? '');
    setSize('M');
    setQuantity('1');
    setToppingId(NO_TOPPING);
  };

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customer.trim() || !selectedProduct || parsedQuantity < 1) {
      alert('Vui lÃ²ng nháº­p khÃ¡ch hÃ ng, chá»n sáº£n pháº©m vÃ  sá»‘ lÆ°á»£ng há»£p lá»‡.');
      return;
    }

    const nextOrder: Order = {
      id: `#AUR${uid().slice(-6).toUpperCase()}`,
      customer: customer.trim(),
      items: computedItems,
      productName: selectedProduct.name,
      size,
      quantity: parsedQuantity,
      toppingName,
      total: computedTotal,
      status: ORDER_STATUSES[0] ?? 'Äang pha',
      time: new Date().toTimeString().slice(0, 5),
    };

    try {
      await onUpdateOrders([nextOrder, ...db.orders]);
      onToast('ÄÃ£ thÃªm Ä‘Æ¡n hÃ ng má»›i vÃ  lÆ°u vÃ o MongoDB');
      clearForm();
      setIsFormOpen(false);
    } catch {
      onToast('KhÃ´ng thá»ƒ lÆ°u Ä‘Æ¡n hÃ ng vÃ o MongoDB');
    }
  };

  const filteredOrders = db.orders.filter(order => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      order.id.toLowerCase().includes(term) ||
      order.customer.toLowerCase().includes(term) ||
      order.items.toLowerCase().includes(term) ||
      (order.productName ?? '').toLowerCase().includes(term) ||
      (order.toppingName ?? '').toLowerCase().includes(term);
    const matchStatus = statusFilter ? order.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight mb-2">ÄÆ¡n hÃ ng</h1>
          <p className="text-[#8b7668]">Quáº£n lÃ½ Ä‘Æ¡n theo sáº£n pháº©m, size, sá»‘ lÆ°á»£ng, topping vÃ  tráº¡ng thÃ¡i.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(value => !value)}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#321b12] text-white rounded-xl text-sm hover:bg-[#47271b] transition-all shadow-sm"
        >
          {isFormOpen ? 'ÄÃ³ng form' : '+ ThÃªm Ä‘Æ¡n hÃ ng'}
        </button>
      </div>

      <div className={isFormOpen ? 'grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start' : ''}>
        {isFormOpen && (
          <form onSubmit={handleAddOrder} className="bg-white border border-black/8 rounded-3xl p-6 shadow-sm xl:col-start-2 xl:row-start-1 xl:sticky xl:top-24">
            <h2 className="text-xl mb-4">ThÃªm mÃ³n</h2>

            <div className="space-y-4">

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#6a3d29] font-medium">Topping</label>
                <select
                  value={toppingId}
                  onChange={e => setToppingId(e.target.value)}
                  className="px-3 py-2 border border-black/10 rounded-xl outline-none bg-white text-sm"
                >
                  <option value={NO_TOPPING}>KhÃ´ng topping</option>
                  {db.toppings.map(topping => (
                    <option key={topping.id} value={topping.id}>
                      {topping.name} - {formatMoney(topping.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#6a3d29] font-medium">Chi tiáº¿t mÃ³n</label>
                <div className="px-3 py-2 border border-black/10 rounded-xl bg-amber-50/20 text-sm min-h-[70px] leading-relaxed">
                  <div>{computedItems || 'Chá»n sáº£n pháº©m Ä‘á»ƒ táº¡o chi tiáº¿t mÃ³n'}</div>
                  <div className="mt-1 text-[#8b7668]">Tá»•ng: {formatMoney(computedTotal)}</div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  clearForm();
                  setIsFormOpen(false);
                }}
                className="px-4 py-2 border border-black/10 rounded-xl text-sm hover:bg-[#fff8ef] transition-all"
              >
                Há»§y
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#daa94f] text-white rounded-xl text-sm hover:opacity-95 transition-all shadow-xs"
              >
                LÆ°u Ä‘Æ¡n hÃ ng
              </button>
            </div>
          </form>
        )}

        <div className="bg-white border border-black/8 rounded-3xl p-6 shadow-sm min-w-0 xl:col-start-1 xl:row-start-1">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="TÃ¬m mÃ£ Ä‘Æ¡n, khÃ¡ch hÃ ng, sáº£n pháº©m hoáº·c topping..."
                className="w-full pl-10 pr-4 py-2 border border-black/10 rounded-xl outline-none bg-amber-50/5 focus:border-[#c98632] transition-all text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-black/10 rounded-xl outline-none bg-white text-sm min-w-[180px]"
            >
              <option value="">Táº¥t cáº£ tráº¡ng thÃ¡i</option>
              {ORDER_STATUSES.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[980px]">
              <thead>
                <tr className="border-b border-black/5 bg-[#fff8ef]">
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">MÃ£ Ä‘Æ¡n</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">KhÃ¡ch hÃ ng</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">Sáº£n pháº©m</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">Size</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">SL</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">Topping</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">Tá»•ng tiá»n</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">Thá»i gian</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">Tráº¡ng thÃ¡i</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668] text-right">Chuyá»ƒn tráº¡ng thÃ¡i</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-sm">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-amber-50/10 transition-all">
                    <td className="p-3 font-mono-custom text-xs text-amber-900">{order.id}</td>
                    <td className="p-3 font-medium">{order.customer}</td>
                    <td className="p-3 text-[#6a3d29]">
                      {order.productName ?? order.items}
                      {!order.productName && <div className="text-[10px] text-[#8b7668]">ÄÆ¡n cÅ©</div>}
                    </td>
                    <td className="p-3 font-mono-custom text-xs">{order.size ?? '-'}</td>
                    <td className="p-3 font-mono-custom text-xs">{order.quantity ?? '-'}</td>
                    <td className="p-3 text-[#6a3d29]">{order.toppingName ?? '-'}</td>
                    <td className="p-3 font-mono-custom text-xs">{formatMoney(order.total)}</td>
                    <td className="p-3 text-[#8b7668]">{order.time}</td>
                    <td className="p-3">
                      <span className={`inline-block text-[11px] px-2.5 py-1 rounded-full ${getBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {ORDER_STATUSES.map(item => (
                          <button
                            key={item}
                            onClick={() => handleUpdateStatus(order.id, item)}
                            disabled={order.status === item}
                            className={`px-2 py-1 text-[11px] rounded-lg border transition-all ${
                              order.status === item
                                ? `${getBadgeClass(item)} cursor-not-allowed`
                                : 'border-black/10 hover:bg-[#fff8ef]'
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-[#8b7668] text-xs">
                      KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng nÃ o trÃ¹ng khá»›p
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
