import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { uid } from '../data';
import { type AppDatabase, type Material } from '../types';

interface MaterialsViewProps {
  db: AppDatabase;
  onUpdateMaterials: (materials: Material[]) => void;
  onToast: (msg: string) => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({ db, onUpdateMaterials, onToast }) => {
  const t = useTranslations('materials');
  const tCommon = useTranslations('common');
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formQty, setFormQty] = useState('');
  const [formUnit, setFormUnit] = useState('');
  const [formMin, setFormMin] = useState('');

  const handleEdit = (m: Material) => {
    setFormId(m.id);
    setFormName(m.name);
    setFormQty(m.qty.toString());
    setFormUnit(m.unit);
    setFormMin(m.min.toString());
  };

  const handleClear = () => {
    setFormId('');
    setFormName('');
    setFormQty('');
    setFormUnit('');
    setFormMin('');
  };

  const handleDelete = (id: string) => {
    if (!window.confirm(t('confirmDelete'))) return;
    const next = db.materials.filter(m => m.id !== id);
    onUpdateMaterials(next);
    onToast(t('deleted'));
    if (formId === id) handleClear();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formQty || !formUnit || !formMin) return;

    const qty = parseFloat(formQty);
    const min = parseFloat(formMin);

    if (isNaN(qty) || isNaN(min)) {
      alert(t('invalidNumbers'));
      return;
    }

    const newMaterial: Material = {
      id: formId || uid(),
      name: formName.trim(),
      qty,
      unit: formUnit.trim(),
      min
    };

    let nextMats = [...db.materials];
    if (formId) {
      nextMats = nextMats.map(m => m.id === formId ? newMaterial : m);
      onToast(t('updated'));
    } else {
      nextMats.push(newMaterial);
      onToast(t('added'));
    }

    onUpdateMaterials(nextMats);
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
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">{t('columns.qty')}</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">{t('columns.unit')}</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">{t('columns.min')}</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">{t('columns.status')}</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668] text-right">{t('columns.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-sm">
                {db.materials.map((m, idx) => {
                  const isLowStock = m.qty <= m.min;
                  return (
                    <tr key={idx} className="hover:bg-amber-50/10 transition-all">
                      <td className="p-3 font-medium flex items-center gap-1.5">
                        {m.name}
                        {isLowStock && (
                          <span title={t('lowStockWarning')}>
                            <AlertTriangle className="w-4 h-4 text-[#b94d3f]" />
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono-custom text-xs">{m.qty}</td>
                      <td className="p-3 text-[#8b7668]">{m.unit}</td>
                      <td className="p-3 font-mono-custom text-xs text-gray-500">{m.min}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full ${
                          isLowStock
                            ? 'bg-red-100 text-[#b94d3f]'
                            : 'bg-green-100 text-[#557e3c]'
                        }`}>
                          {isLowStock ? t('lowStock') : t('inStock')}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEdit(m)}
                            className="px-2.5 py-1 text-xs border border-black/10 rounded-lg hover:bg-[#fff8ef] transition-all"
                          >
                            {tCommon('edit')}
                          </button>
                          <button
                            onClick={() => handleDelete(m.id)}
                            className="px-2.5 py-1 text-xs border border-red-200 text-red-600 bg-red-50/20 rounded-lg hover:bg-red-50 transition-all"
                          >
                            {tCommon('delete')}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#6a3d29] font-medium">{t('qtyLabel')}</label>
                <input
                  type="number"
                  value={formQty}
                  onChange={e => setFormQty(e.target.value)}
                  placeholder="20"
                  className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm font-mono-custom"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#6a3d29] font-medium">{t('unitLabel')}</label>
                <input
                  value={formUnit}
                  onChange={e => setFormUnit(e.target.value)}
                  placeholder={t('unitPlaceholder')}
                  className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6a3d29] font-medium">{t('minLabel')}</label>
              <input
                type="number"
                value={formMin}
                onChange={e => setFormMin(e.target.value)}
                placeholder="5"
                className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm font-mono-custom"
                required
              />
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
