import { useLocale, useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { uid } from '../data';
import { type AppDatabase, type Topping } from '../types';

interface ToppingsViewProps {
  db: AppDatabase;
  onUpdateToppings: (toppings: Topping[]) => void;
  onToast: (msg: string) => void;
}

export const ToppingsView: React.FC<ToppingsViewProps> = ({ db, onUpdateToppings, onToast }) => {
  const t = useTranslations('toppings');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formActive, setFormActive] = useState('true');

  const formatMoney = (n: number) => `${n.toLocaleString(locale === 'en' ? 'en-US' : 'vi-VN')}đ`;

  const handleEdit = (item: Topping) => {
    setFormId(item.id);
    setFormName(item.name);
    setFormPrice(item.price.toString());
    setFormActive(item.active ? 'true' : 'false');
  };

  const handleClear = () => {
    setFormId('');
    setFormName('');
    setFormPrice('');
    setFormActive('true');
  };

  const handleDelete = (id: string) => {
    if (!window.confirm(t('confirmDelete'))) return;
    const next = db.toppings.filter(item => item.id !== id);
    onUpdateToppings(next);
    onToast(t('deleted'));
    if (formId === id) handleClear();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice) return;

    const price = parseFloat(formPrice);
    if (isNaN(price)) {
      alert(t('invalidPrice'));
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
      nextToppings = nextToppings.map(item => item.id === formId ? newTopping : item);
      onToast(t('updated'));
    } else {
      nextToppings.push(newTopping);
      onToast(t('added'));
    }

    onUpdateToppings(nextToppings);
    handleClear();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight mb-2">{t('title')}</h1>
          <p className="text-[#8b7668]">{t('description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="bg-white border border-black/8 rounded-3xl p-6 lg:col-span-8 shadow-sm">
          <h2 className="text-xl mb-4">{t('listTitle')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/5 bg-[#fff8ef]">
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">{t('columns.name')}</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">{t('columns.price')}</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">{t('columns.status')}</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668] text-right">{t('columns.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-sm">
                {db.toppings.map((item, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/10 transition-all">
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3 font-mono-custom text-xs">{formatMoney(item.price)}</td>
                    <td className="p-3">
                      <span className={`inline-block text-[11px] px-2.5 py-1 rounded-full ${item.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.active ? t('selling') : t('hidden')}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-2.5 py-1 text-xs border border-black/10 rounded-lg hover:bg-[#fff8ef] transition-all"
                        >
                          {tCommon('edit')}
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-2.5 py-1 text-xs border border-red-200 text-red-600 bg-red-50/20 rounded-lg hover:bg-red-50 transition-all"
                        >
                          {tCommon('delete')}
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
          <h2 className="text-xl mb-4 pb-3 border-b border-black/5">{t('formTitle')}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6a3d29] font-medium">{t('nameLabel')}</label>
              <input
                value={formName}
                onChange={e => setFormName(e.target.value)}
                placeholder={t('namePlaceholder')}
                className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6a3d29] font-medium">{t('priceLabel')}</label>
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
              <label className="text-xs text-[#6a3d29] font-medium">{t('statusLabel')}</label>
              <select
                value={formActive}
                onChange={e => setFormActive(e.target.value)}
                className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none bg-white text-sm"
              >
                <option value="true">{t('sellingOption')}</option>
                <option value="false">{t('hiddenOption')}</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-[#daa94f] text-white rounded-xl hover:opacity-95 transition-all text-sm font-medium shadow-sm"
            >
              {t('save')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
