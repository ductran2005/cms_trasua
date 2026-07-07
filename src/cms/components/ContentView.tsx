import { Globe, Sparkles } from 'lucide-react';
import React, { useState } from 'react';

import { type AppDatabase, type ContentState } from '../types';

interface ContentViewProps {
  db: AppDatabase;
  onUpdateContent: (content: ContentState) => void;
  onToast: (msg: string) => void;
}

export const ContentView: React.FC<ContentViewProps> = ({ db, onUpdateContent, onToast }) => {
  const [heroTitleVi, setHeroTitleVi] = useState(db.content.heroTitleVi);
  const [heroDescVi, setHeroDescVi] = useState(db.content.heroDescVi);
  const [heroTitleEn, setHeroTitleEn] = useState(db.content.heroTitleEn);
  const [heroDescEn, setHeroDescEn] = useState(db.content.heroDescEn);
  const [storyTitle, setStoryTitle] = useState(db.content.storyTitle);
  const [storyDesc, setStoryDesc] = useState(db.content.storyDesc);
  const [ctaText, setCtaText] = useState(db.content.ctaText);
  const [ctaButton, setCtaButton] = useState(db.content.ctaButton);

  const [previewLang, setPreviewLang] = useState<'vi' | 'en'>('vi');

  const handleSave = () => {
    const nextContent: ContentState = {
      heroTitleVi: heroTitleVi.trim(),
      heroDescVi: heroDescVi.trim(),
      heroTitleEn: heroTitleEn.trim(),
      heroDescEn: heroDescEn.trim(),
      storyTitle: storyTitle.trim(),
      storyDesc: storyDesc.trim(),
      ctaText: ctaText.trim(),
      ctaButton: ctaButton.trim(),
    };
    onUpdateContent(nextContent);
    onToast('Đã lưu nội dung trang chủ');
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight mb-2">Nội dung trang chủ</h1>
          <p className="text-[#8b7668]">Chỉnh hero, story, CTA và text i18n Việt / Anh.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Forms area */}
        <div className="bg-white border border-black/8 rounded-3xl p-6 lg:col-span-7 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vietnamese Card */}
            <div className="border border-black/5 p-4 rounded-2xl bg-[#fffdf8] space-y-4">
              <h3 className="text-base font-medium text-amber-900 flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> Hero — Tiếng Việt
              </h3>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-[#8b7668]">Tiêu đề</label>
                <input 
                  value={heroTitleVi}
                  onChange={e => setHeroTitleVi(e.target.value)}
                  className="w-full px-3 py-1.5 border border-black/10 rounded-lg outline-none bg-white text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-[#8b7668]">Mô tả</label>
                <textarea 
                  value={heroDescVi}
                  onChange={e => setHeroDescVi(e.target.value)}
                  className="w-full px-3 py-1.5 border border-black/10 rounded-lg outline-none bg-white text-sm min-h-[70px] resize-y"
                />
              </div>
            </div>

            {/* English Card */}
            <div className="border border-black/5 p-4 rounded-2xl bg-[#fffdf8] space-y-4">
              <h3 className="text-base font-medium text-amber-900 flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> Hero — English
              </h3>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-[#8b7668]">Title</label>
                <input 
                  value={heroTitleEn}
                  onChange={e => setHeroTitleEn(e.target.value)}
                  className="w-full px-3 py-1.5 border border-black/10 rounded-lg outline-none bg-white text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-[#8b7668]">Description</label>
                <textarea 
                  value={heroDescEn}
                  onChange={e => setHeroDescEn(e.target.value)}
                  className="w-full px-3 py-1.5 border border-black/10 rounded-lg outline-none bg-white text-sm min-h-[70px] resize-y"
                />
              </div>
            </div>
          </div>

          {/* Story Card */}
          <div className="border border-black/5 p-4 rounded-2xl bg-[#fffdf8] space-y-4">
            <h3 className="text-base font-medium text-amber-900">Story Section (Câu chuyện)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 flex flex-col gap-1">
                <label className="text-[11px] text-[#8b7668]">Tiêu đề</label>
                <input 
                  value={storyTitle}
                  onChange={e => setStoryTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-black/10 rounded-lg outline-none bg-white text-sm"
                />
              </div>
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-[11px] text-[#8b7668]">Nội dung mô tả</label>
                <textarea 
                  value={storyDesc}
                  onChange={e => setStoryDesc(e.target.value)}
                  className="w-full px-3 py-1.5 border border-black/10 rounded-lg outline-none bg-white text-sm min-h-[44px] resize-y"
                />
              </div>
            </div>
          </div>

          {/* CTA Card */}
          <div className="border border-black/5 p-4 rounded-2xl bg-[#fffdf8] space-y-4">
            <h3 className="text-base font-medium text-amber-900">CTA Section (Kêu gọi đặt hàng)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-[#8b7668]">Dòng chữ CTA</label>
                <input 
                  value={ctaText}
                  onChange={e => setCtaText(e.target.value)}
                  className="w-full px-3 py-1.5 border border-black/10 rounded-lg outline-none bg-white text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] text-[#8b7668]">Chữ trên nút</label>
                <input 
                  value={ctaButton}
                  onChange={e => setCtaButton(e.target.value)}
                  className="w-full px-3 py-1.5 border border-black/10 rounded-lg outline-none bg-white text-sm"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="px-6 py-2.5 bg-[#daa94f] text-white rounded-xl hover:opacity-95 transition-all text-sm font-medium shadow-sm"
          >
            Lưu nội dung
          </button>
        </div>

        {/* Preview Area */}
        <div className="bg-white border border-black/8 rounded-3xl p-6 lg:col-span-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-black/5 pb-2">
            <h2 className="text-xl">Preview Hero</h2>
            <div className="flex rounded-lg border border-black/10 overflow-hidden bg-gray-50 text-[11px]">
              <button 
                onClick={() => setPreviewLang('vi')}
                className={`px-2.5 py-1 ${previewLang === 'vi' ? 'bg-[#321b12] text-white' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                Tiếng Việt
              </button>
              <button 
                onClick={() => setPreviewLang('en')}
                className={`px-2.5 py-1 ${previewLang === 'en' ? 'bg-[#321b12] text-white' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                English
              </button>
            </div>
          </div>

          {/* Simulated Mobile/Browser Header Card */}
          <div className="border border-black/10 rounded-2xl overflow-hidden shadow-md">
            {/* Window title bar */}
            <div className="bg-gray-100 px-4 py-2 flex items-center gap-1.5 border-b border-black/5 text-[10px] text-gray-400 font-mono-custom">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block"></span>
              <span className="ml-2 truncate max-w-[200px]">https://auratea.vn</span>
            </div>

            {/* Preview Canvas */}
            <div 
              className="min-h-[280px] p-6 flex flex-col justify-end text-white bg-cover bg-center relative"
              style={{
                backgroundImage: `linear-gradient(to top, rgba(50,27,18,0.95) 0%, rgba(50,27,18,0.4) 60%, transparent 100%), url("https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?q=80&w=1000&auto=format&fit=crop")`
              }}
            >
              {/* Logo badge */}
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-full text-white text-[10px]">
                <span className="w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center text-black font-bold text-[8px]">A</span>
                AURATEA
              </div>

              <div>
                <h2 className="text-2xl font-light tracking-tight text-white leading-tight">
                  {previewLang === 'vi' ? heroTitleVi : heroTitleEn}
                </h2>
                <p className="text-[11px] text-white/70 mt-2 line-clamp-2 leading-relaxed">
                  {previewLang === 'vi' ? heroDescVi : heroDescEn}
                </p>
                <div className="mt-4 flex gap-2">
                  <button className="px-4 py-1.5 bg-amber-400 hover:bg-amber-500 text-black text-xs rounded-full shadow-sm">
                    {ctaButton || 'Đặt trà'}
                  </button>
                </div>
              </div>
            </div>

            {/* Story display mock */}
            <div className="bg-[#fff8ef] p-5 text-center text-xs space-y-2 border-t border-black/5">
              <h4 className="font-medium text-amber-900 text-sm flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> {storyTitle}
              </h4>
              <p className="text-[#8b7668] leading-relaxed max-w-sm mx-auto">{storyDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
