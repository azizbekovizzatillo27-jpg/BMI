import React, { useState, useEffect } from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';
import { statsAPI } from '../../services/api';

export default function StatsModal({ isOpen, onClose, stats, onSuccess, addToast }) {
  const [formData, setFormData] = useState({
    students: 0,
    teachers: 0,
    graduates: 0,
    labs: 0,
    partners: 0,
    years_active: 0,
    programs: 0,
    research_papers: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (stats && isOpen) {
      setFormData({
        students: stats.students || 0,
        teachers: stats.teachers || 0,
        graduates: stats.graduates || 0,
        labs: stats.labs || 0,
        partners: stats.partners || 0,
        years_active: stats.years_active || 0,
        programs: stats.programs || 0,
        research_papers: stats.research_papers || 0
      });
    }
  }, [stats, isOpen]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: parseInt(e.target.value) || 0 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await statsAPI.update(formData);
      addToast('Statistika muvaffaqiyatli yangilandi', 'success');
      onSuccess();
      onClose();
    } catch (err) {
      addToast('Xatolik yuz berdi', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay animate-fade-in" onClick={onClose}>
      <div className="admin-modal-content animate-slide-up" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
        <div className="admin-modal-header">
          <h2 className="text-xl font-bold">Statistikani Tahrirlash</h2>
          <button onClick={onClose} className="admin-action-btn"><HiOutlineXMark /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label>Talabalar soni</label>
              <input type="number" name="students" className="admin-input" value={formData.students} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>O'qituvchilar soni</label>
              <input type="number" name="teachers" className="admin-input" value={formData.teachers} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Bitiruvchilar soni</label>
              <input type="number" name="graduates" className="admin-input" value={formData.graduates} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Ilmiy ishlar soni</label>
              <input type="number" name="research_papers" className="admin-input" value={formData.research_papers} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Laboratoriyalar soni</label>
              <input type="number" name="labs" className="admin-input" value={formData.labs} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Hamkorlar soni</label>
              <input type="number" name="partners" className="admin-input" value={formData.partners} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Faoliyat yillari</label>
              <input type="number" name="years_active" className="admin-input" value={formData.years_active} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Ta'lim yo'nalishlari</label>
              <input type="number" name="programs" className="admin-input" value={formData.programs} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-color" style={{ borderColor: 'var(--border-color)' }}>
            <button type="button" onClick={onClose} className="btn bg-secondary border-none">Bekor qilish</button>
            <button type="submit" className="auth-submit-btn" style={{ margin: 0, padding: '10px 24px', width: 'auto' }} disabled={loading}>
              {loading ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
