import React, { useState } from 'react';
import { AppDatabase, Staff } from '../types';
import { uid } from '../data';

interface StaffViewProps {
  db: AppDatabase;
  onUpdateStaff: (staff: Staff[]) => void;
  onToast: (msg: string) => void;
}

export const StaffView: React.FC<StaffViewProps> = ({ db, onUpdateStaff, onToast }) => {
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('Pha chế');
  const [formPhone, setFormPhone] = useState('');
  const [formActive, setFormActive] = useState('true');

  const handleEdit = (s: Staff) => {
    setFormId(s.id);
    setFormName(s.name);
    setFormRole(s.role);
    setFormPhone(s.phone);
    setFormActive(s.active ? 'true' : 'false');
  };

  const handleClear = () => {
    setFormId('');
    setFormName('');
    setFormRole('Pha chế');
    setFormPhone('');
    setFormActive('true');
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Xác nhận xóa nhân viên này khỏi danh sách?')) return;
    const next = db.staff.filter(s => s.id !== id);
    onUpdateStaff(next);
    onToast('Đã xóa nhân viên');
    if (formId === id) handleClear();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) return;

    const newStaff: Staff = {
      id: formId || uid(),
      name: formName.trim(),
      role: formRole,
      phone: formPhone.trim(),
      active: formActive === 'true'
    };

    let nextStaff = [...db.staff];
    if (formId) {
      nextStaff = nextStaff.map(s => s.id === formId ? newStaff : s);
      onToast('Đã cập nhật thông tin nhân viên');
    } else {
      nextStaff.push(newStaff);
      onToast('Đã thêm nhân viên mới');
    }

    onUpdateStaff(nextStaff);
    handleClear();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-light tracking-tight mb-2">Nhân viên</h1>
          <p className="text-[#8b7668]">Quản lý thông tin nhân viên, vai trò và trạng thái làm việc.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="bg-white border border-black/8 rounded-3xl p-6 lg:col-span-8 shadow-sm">
          <h2 className="text-xl mb-4">Danh sách nhân viên</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-black/5 bg-[#fff8ef]">
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">Họ tên</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">Vai trò</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">SĐT</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668]">Trạng thái</th>
                  <th className="p-3 text-[11px] uppercase tracking-wider text-[#8b7668] text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-sm">
                {db.staff.map((s, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/10 transition-all">
                    <td className="p-3 font-medium">{s.name}</td>
                    <td className="p-3 text-amber-900">{s.role}</td>
                    <td className="p-3 font-mono-custom text-xs text-gray-500">{s.phone}</td>
                    <td className="p-3">
                      <span className={`inline-block text-[11px] px-2.5 py-1 rounded-full ${s.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {s.active ? 'Đang làm' : 'Nghỉ'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => handleEdit(s)}
                          className="px-2.5 py-1 text-xs border border-black/10 rounded-lg hover:bg-[#fff8ef] transition-all"
                        >
                          Sửa
                        </button>
                        <button 
                          onClick={() => handleDelete(s.id)}
                          className="px-2.5 py-1 text-xs border border-red-200 text-red-600 bg-red-50/20 rounded-lg hover:bg-red-50 transition-all"
                        >
                          Xóa
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
          <h2 className="text-xl mb-4 pb-3 border-b border-black/5">Thêm / sửa nhân viên</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6a3d29] font-medium">Họ tên nhân viên *</label>
              <input 
                value={formName}
                onChange={e => setFormName(e.target.value)}
                placeholder="Nguyễn Văn A" 
                className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#6a3d29] font-medium">Vai trò</label>
                <select 
                  value={formRole}
                  onChange={e => setFormRole(e.target.value)}
                  className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none bg-white text-sm"
                >
                  <option value="Pha chế">Pha chế</option>
                  <option value="Thu ngân">Thu ngân</option>
                  <option value="Giao hàng">Giao hàng</option>
                  <option value="Quản lý">Quản lý</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#6a3d29] font-medium">SĐT *</label>
                <input 
                  value={formPhone}
                  onChange={e => setFormPhone(e.target.value)}
                  placeholder="0912345678" 
                  className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none focus:border-[#c98632] transition-all text-sm font-mono-custom"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#6a3d29] font-medium">Trạng thái làm việc</label>
              <select 
                value={formActive}
                onChange={e => setFormActive(e.target.value)}
                className="w-full px-3.5 py-2 border border-black/10 rounded-xl outline-none bg-white text-sm"
              >
                <option value="true">Đang làm</option>
                <option value="false">Nghỉ / Tạm dừng</option>
              </select>
            </div>

            <button 
              type="submit"
              className="w-full py-2.5 bg-[#daa94f] text-white rounded-xl hover:opacity-95 transition-all text-sm font-medium shadow-sm"
            >
              Lưu nhân viên
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
