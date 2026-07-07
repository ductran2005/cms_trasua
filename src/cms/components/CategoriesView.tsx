import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { uid } from '../data';
import { type AppDatabase, type Category } from '../types';

interface CategoriesViewProps {
  db: AppDatabase;
  onUpdateCategories: (categories: Category[]) => void;
  onToast: (msg: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({ db, onUpdateCategories, onToast }) => {
  const t = useTranslations('categories');
  const tCommon = useTranslations('common');
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const handleEdit = (c: Category) => {
    setFormId(c.id);
    setFormName(c.name);
    setFormDesc(c.desc);
  };

  const handleClear = () => {
    setFormId('');
    setFormName('');
    setFormDesc('');
  };

  const handleDelete = (id: string) => {
    if (!window.confirm(t('confirmDelete'))) return;
    const next = db.categories.filter(c => c.id !== id);
    onUpdateCategories(next);
    onToast(t('deleted'));
    if (formId === id) handleClear();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) return;

    const newCategory: Category = {
      id: formId || uid(),
      name: formName.trim(),
      desc: formDesc.trim()
    };

    let nextCats = [...db.categories];
    if (formId) {
      nextCats = nextCats.map(c => c.id === formId ? newCategory : c);
      onToast(t('updated'));
    } else {
      nextCats.push(newCategory);
      onToast(t('added'));
    }

    onUpdateCategories(nextCats);
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
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">{t('columns.desc')}</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668] text-right">{t('columns.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-sm">
                {db.categories.map((c, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/10 transition-all">
                    <td className="p-3 font-medium">{c.name}</td>
                    <td className="p-3 text-[#8b7668]">{c.desc || '-'}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(c)}
                          className="px-2.5 py-1 text-xs border border-black/10 rounded-lg hover:bg-[#fff8ef] transition-all"
                        >
                          {tCommon('edit')}
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
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
              <label className="text-xs text-[#6a3d29] font-medium">{t('descLabel')}</label>
              <textarea
                value={formDesc}
                onChange={e => setFormDesc(e.target.value)}
                placeholder={t('descPlaceholder')}
                className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm min-h-[100px] resize-y"
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
