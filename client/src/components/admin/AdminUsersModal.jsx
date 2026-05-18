import { useState } from 'react';
import { HiOutlineXMark, HiOutlineUserPlus } from 'react-icons/hi2';
import { authAPI } from '../../services/api';

export default function AdminUsersModal({ isOpen, onClose, onSuccess, addToast }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.createAdmin(formData);
      addToast("Yangi admin muvaffaqiyatli qo'shildi", 'success');
      onSuccess();
      onClose();
      setFormData({ name: '', email: '', password: '' });
    } catch (err) {
      addToast(err.response?.data?.error || "Xatolik yuz berdi", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-slide-in">
        <div className="flex justify-between items-center p-6 border-b border-color">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <HiOutlineUserPlus className="text-primary-600" /> Yangi Admin Qo'shish
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors text-muted">
            <HiOutlineXMark size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-muted mb-2 uppercase tracking-wide">To'liq ism</label>
            <input
              type="text"
              required
              className="auth-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Masalan: Aliyev Vali"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-muted mb-2 uppercase tracking-wide">Elektron pochta</label>
            <input
              type="email"
              required
              className="auth-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="admin@namdtu.uz"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-muted mb-2 uppercase tracking-wide">Maxfiy parol</label>
            <input
              type="password"
              required
              className="auth-input"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Kuchli parol kiriting"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-color">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl font-bold text-muted hover:bg-secondary transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn m-0"
              style={{ width: 'auto', padding: '10px 24px' }}
            >
              {loading ? 'Saqlanmoqda...' : 'Admin Qo\'shish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
