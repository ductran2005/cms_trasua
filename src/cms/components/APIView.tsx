import React from 'react';

export const APIView: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight mb-2">Endpoint MongoDB</h1>
          <p className="text-[#8b7668]">Danh sách API đề xuất khi chuyển đổi CMS này sang hệ thống production lưu cơ sở dữ liệu thực.</p>
        </div>
      </div>

      <div className="bg-white border border-black/8 rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl mb-6">Cấu trúc API tham khảo</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-black/5 rounded-2xl bg-[#fffdf8] space-y-3">
            <h3 className="text-base font-medium text-[#321b12]">Products CRUD</h3>
            <div className="bg-[#271811] text-[#ffe6b5] p-3 rounded-xl overflow-x-auto text-xs font-mono-custom space-y-1">
              <div>GET /api/products</div>
              <div>POST /api/products</div>
              <div>PUT /api/products/:id</div>
              <div>DELETE /api/products/:id</div>
            </div>
          </div>

          <div className="p-4 border border-black/5 rounded-2xl bg-[#fffdf8] space-y-3">
            <h3 className="text-base font-medium text-[#321b12]">Categories CRUD</h3>
            <div className="bg-[#271811] text-[#ffe6b5] p-3 rounded-xl overflow-x-auto text-xs font-mono-custom space-y-1">
              <div>GET /api/categories</div>
              <div>POST /api/categories</div>
              <div>PUT /api/categories/:id</div>
              <div>DELETE /api/categories/:id</div>
            </div>
          </div>

          <div className="p-4 border border-black/5 rounded-2xl bg-[#fffdf8] space-y-3">
            <h3 className="text-base font-medium text-[#321b12]">Toppings CRUD</h3>
            <div className="bg-[#271811] text-[#ffe6b5] p-3 rounded-xl overflow-x-auto text-xs font-mono-custom space-y-1">
              <div>GET /api/toppings</div>
              <div>POST /api/toppings</div>
              <div>PUT /api/toppings/:id</div>
              <div>DELETE /api/toppings/:id</div>
            </div>
          </div>

          <div className="p-4 border border-black/5 rounded-2xl bg-[#fffdf8] space-y-3">
            <h3 className="text-base font-medium text-[#321b12]">Materials CRUD</h3>
            <div className="bg-[#271811] text-[#ffe6b5] p-3 rounded-xl overflow-x-auto text-xs font-mono-custom space-y-1">
              <div>GET /api/materials</div>
              <div>POST /api/materials</div>
              <div>PUT /api/materials/:id</div>
              <div>DELETE /api/materials/:id</div>
            </div>
          </div>

          <div className="p-4 border border-black/5 rounded-2xl bg-[#fffdf8] space-y-3">
            <h3 className="text-base font-medium text-[#321b12]">Staff CRUD</h3>
            <div className="bg-[#271811] text-[#ffe6b5] p-3 rounded-xl overflow-x-auto text-xs font-mono-custom space-y-1">
              <div>GET /api/staff</div>
              <div>POST /api/staff</div>
              <div>PUT /api/staff/:id</div>
              <div>DELETE /api/staff/:id</div>
            </div>
          </div>

          <div className="p-4 border border-black/5 rounded-2xl bg-[#fffdf8] space-y-3">
            <h3 className="text-base font-medium text-[#321b12]">Content + i18n</h3>
            <div className="bg-[#271811] text-[#ffe6b5] p-3 rounded-xl overflow-x-auto text-xs font-mono-custom space-y-1">
              <div>GET /api/content</div>
              <div>PUT /api/content</div>
              <div>GET /api/content?lang=vi</div>
              <div>GET /api/content?lang=en</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
