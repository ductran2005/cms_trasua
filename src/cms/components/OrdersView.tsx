import { Search } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { uid } from '../data';
import { type AppDatabase, type Order } from '../types';

interface OrdersViewProps {
  db: AppDatabase;
  onUpdateOrders: (orders: Order[]) => Promise<void> | void;
  onToast: (msg: string) => void;
}

const NO_TOPPING = '__none__';
const STATUS_KEYS = ['preparing', 'delivering', 'completed', 'canceled'] as const;
type StatusKey = (typeof STATUS_KEYS)[number];

function getStatusKey(status: string): StatusKey {
  if (STATUS_KEYS.includes(status as StatusKey)) return status as StatusKey;

  const normalized = status.toLowerCase();
  if (normalized.includes('giao')) return 'delivering';
  if (normalized.includes('huy') || normalized.includes('hủy') || normalized.includes('cancel')) return 'canceled';
  if (normalized.includes('ho') || normalized.includes('xong') || normalized.includes('complete')) return 'completed';
  return 'preparing';
}

export const OrdersView: React.FC<OrdersViewProps> = ({ db, onUpdateOrders, onToast }) => {
  const t = useTranslations('orders');
  const locale = useLocale();
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
  const toppingName = selectedTopping?.name ?? t('noTopping');
  const computedItems = selectedProduct
    ? `${selectedProduct.name} size ${size} x${parsedQuantity}${selectedTopping ? `, topping ${selectedTopping.name}` : ''}`
    : '';

  const formatMoney = (n: number) => `${n.toLocaleString(locale === 'en' ? 'en-US' : 'vi-VN')}đ`;

  const getStatusLabel = (status: string) => t(`status.${getStatusKey(status)}`);

  const getBadgeClass = (status: string) => {
    switch (getStatusKey(status)) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'delivering':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-amber-100 text-amber-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateStatus = async (id: string, nextStatus: StatusKey) => {
    const next = db.orders.map(order => (order.id === id ? { ...order, status: nextStatus } : order));
    try {
      await onUpdateOrders(next);
      onToast(t('statusSaved', { status: t(`status.${nextStatus}`) }));
    } catch {
      onToast(t('statusSaveError'));
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
      alert(t('invalidForm'));
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
      status: 'preparing',
      time: new Date().toTimeString().slice(0, 5),
    };

    try {
      await onUpdateOrders([nextOrder, ...db.orders]);
      onToast(t('orderSaved'));
      clearForm();
      setIsFormOpen(false);
    } catch {
      onToast(t('orderSaveError'));
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
    const matchStatus = statusFilter ? getStatusKey(order.status) === statusFilter : true;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight mb-2">{t('title')}</h1>
          <p className="text-[#8b7668]">{t('description')}</p>
        </div>
        <button
          onClick={() => setIsFormOpen(value => !value)}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#321b12] text-white rounded-xl text-sm hover:bg-[#47271b] transition-all shadow-sm"
        >
          {isFormOpen ? t('closeForm') : t('addOrder')}
        </button>
      </div>

      <div className={isFormOpen ? 'grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-6 items-start' : ''}>
        {isFormOpen && (
          <form onSubmit={handleAddOrder} className="bg-white border border-black/8 rounded-3xl p-6 shadow-sm xl:col-start-2 xl:row-start-1 xl:sticky xl:top-24">
            <h2 className="text-xl mb-4">{t('addItem')}</h2>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#6a3d29] font-medium">{t('customer')}</label>
                <input
                  value={customer}
                  onChange={e => setCustomer(e.target.value)}
                  className="px-3 py-2 border border-black/10 rounded-xl outline-none bg-white focus:border-[#c98632] text-sm"
                  placeholder={t('customerPlaceholder')}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#6a3d29] font-medium">{t('product')}</label>
                <select
                  value={selectedProduct?.id ?? ''}
                  onChange={e => setProductId(e.target.value)}
                  className="px-3 py-2 border border-black/10 rounded-xl outline-none bg-white text-sm"
                >
                  {db.products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#6a3d29] font-medium">{t('size')}</label>
                  <select
                    value={size}
                    onChange={e => setSize(e.target.value as 'M' | 'L')}
                    className="px-3 py-2 border border-black/10 rounded-xl outline-none bg-white text-sm"
                  >
                    <option value="M">M - {formatMoney(selectedProduct?.priceM ?? 0)}</option>
                    <option value="L">L - {formatMoney(selectedProduct?.priceL ?? 0)}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-[#6a3d29] font-medium">{t('quantity')}</label>
                  <input
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    type="number"
                    min="1"
                    className="px-3 py-2 border border-black/10 rounded-xl outline-none bg-white focus:border-[#c98632] text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#6a3d29] font-medium">{t('topping')}</label>
                <select
                  value={toppingId}
                  onChange={e => setToppingId(e.target.value)}
                  className="px-3 py-2 border border-black/10 rounded-xl outline-none bg-white text-sm"
                >
                  <option value={NO_TOPPING}>{t('noTopping')}</option>
                  {db.toppings.map(topping => (
                    <option key={topping.id} value={topping.id}>
                      {topping.name} - {formatMoney(topping.price)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-[#6a3d29] font-medium">{t('itemDetail')}</label>
                <div className="px-3 py-2 border border-black/10 rounded-xl bg-amber-50/20 text-sm min-h-[70px] leading-relaxed">
                  <div>{computedItems || t('chooseProduct')}</div>
                  <div className="mt-1 text-[#8b7668]">{t('total')}: {formatMoney(computedTotal)}</div>
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
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#daa94f] text-white rounded-xl text-sm hover:opacity-95 transition-all shadow-xs"
              >
                {t('saveOrder')}
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
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 border border-black/10 rounded-xl outline-none bg-amber-50/5 focus:border-[#c98632] transition-all text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-black/10 rounded-xl outline-none bg-white text-sm min-w-[180px]"
            >
              <option value="">{t('allStatuses')}</option>
              {STATUS_KEYS.map(statusKey => (
                <option key={statusKey} value={statusKey}>
                  {t(`status.${statusKey}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[980px]">
              <thead>
                <tr className="border-b border-black/5 bg-[#fff8ef]">
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">{t('columns.orderId')}</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">{t('columns.customer')}</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">{t('columns.product')}</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">{t('columns.size')}</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">{t('columns.quantity')}</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">{t('columns.topping')}</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">{t('columns.total')}</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">{t('columns.time')}</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">{t('columns.status')}</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668] text-right">{t('columns.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-sm">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-amber-50/10 transition-all">
                    <td className="p-3 font-mono-custom text-xs text-amber-900">{order.id}</td>
                    <td className="p-3 font-medium">{order.customer}</td>
                    <td className="p-3 text-[#6a3d29]">
                      {order.productName ?? order.items}
                      {!order.productName && <div className="text-[10px] text-[#8b7668]">{t('legacyOrder')}</div>}
                    </td>
                    <td className="p-3 font-mono-custom text-xs">{order.size ?? '-'}</td>
                    <td className="p-3 font-mono-custom text-xs">{order.quantity ?? '-'}</td>
                    <td className="p-3 text-[#6a3d29]">{order.toppingName ?? '-'}</td>
                    <td className="p-3 font-mono-custom text-xs">{formatMoney(order.total)}</td>
                    <td className="p-3 text-[#8b7668]">{order.time}</td>
                    <td className="p-3">
                      <span className={`inline-block text-[11px] px-2.5 py-1 rounded-full ${getBadgeClass(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {STATUS_KEYS.map(statusKey => (
                          <button
                            key={statusKey}
                            onClick={() => handleUpdateStatus(order.id, statusKey)}
                            disabled={getStatusKey(order.status) === statusKey}
                            className={`px-2 py-1 text-[11px] rounded-lg border transition-all ${
                              getStatusKey(order.status) === statusKey
                                ? `${getBadgeClass(statusKey)} cursor-not-allowed`
                                : 'border-black/10 hover:bg-[#fff8ef]'
                            }`}
                          >
                            {t(`status.${statusKey}`)}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-[#8b7668] text-xs">
                      {t('empty')}
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
