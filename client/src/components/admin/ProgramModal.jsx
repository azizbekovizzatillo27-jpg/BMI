import { useState, useEffect } from 'react';
import { programsAPI } from '../../services/api';
import { HiOutlineXMark } from 'react-icons/hi2';

export default function ProgramModal({ isOpen, onClose, program, onSuccess, addToast }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    level: 'bachelor',
    name_uz: '',
    name_ru: '',
    name_en: '',
    duration_uz: '',
    duration_ru: '',
    duration_en: '',
    description_uz: '',
    description_ru: '',
    description_en: '',
    seats: '',
    tuition_uz: '',
    tuition_ru: '',
    tuition_en: ''
  });

  useEffect(() => {
    if (program) {
      setFormData(program);
    } else {
      setFormData({
        code: '',
        level: 'bachelor',
        name_uz: '',
        name_ru: '',
        name_en: '',
        duration_uz: '',
        duration_ru: '',
        duration_en: '',
        description_uz: '',
        description_ru: '',
        description_en: '',
        seats: '',
        tuition_uz: '',
        tuition_ru: '',
        tuition_en: ''
      });
    }
  }, [program, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (program) {
        await programsAPI.update(program.id, formData);
        addToast('Muvaffaqiyatli yangilandi', 'success');
      } else {
        await programsAPI.create(formData);
        addToast('Muvaffaqiyatli qo\'shildi', 'success');
      }
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <h2>{program ? 'Yo\'nalishni tahrirlash' : 'Yangi yo\'nalish qo\'shish'}</h2>
          <button className="modal-close" onClick={onClose}><HiOutlineXMark /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Yo'nalish kodi</label>
              <input 
                className="form-input" 
                value={formData.code} 
                onChange={e => setFormData({...formData, code: e.target.value})} 
                placeholder="Masalan: 60610200" 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Daraja</label>
              <select 
                className="form-input" 
                value={formData.level} 
                onChange={e => setFormData({...formData, level: e.target.value})}
              >
                <option value="bachelor">Bakalavr</option>
                <option value="master">Magistratura</option>
              </select>
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Nomi (UZ)</label>
              <input className="form-input" value={formData.name_uz} onChange={e => setFormData({...formData, name_uz: e.target.value})} required />
            </div>
            <div className="form-group">
              <label className="form-label">Nomi (RU)</label>
              <input className="form-input" value={formData.name_ru} onChange={e => setFormData({...formData, name_ru: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Nomi (EN)</label>
              <input className="form-input" value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value})} />
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Muddati (UZ)</label>
              <input className="form-input" value={formData.duration_uz} onChange={e => setFormData({...formData, duration_uz: e.target.value})} placeholder="4 yil" required />
            </div>
            <div className="form-group">
              <label className="form-label">Muddati (RU)</label>
              <input className="form-input" value={formData.duration_ru} onChange={e => setFormData({...formData, duration_ru: e.target.value})} placeholder="4 года" />
            </div>
            <div className="form-group">
              <label className="form-label">Muddati (EN)</label>
              <input className="form-input" value={formData.duration_en} onChange={e => setFormData({...formData, duration_en: e.target.value})} placeholder="4 years" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tavsif (UZ)</label>
            <textarea className="form-input" value={formData.description_uz} onChange={e => setFormData({...formData, description_uz: e.target.value})} rows="2" required />
          </div>

          <div className="grid-2">
             <div className="form-group">
                <label className="form-label">Qabul soni</label>
                <input type="number" className="form-input" value={formData.seats} onChange={e => setFormData({...formData, seats: e.target.value})} required />
             </div>
             <div className="form-group">
                <label className="form-label">Kontrakt miqdori (UZ)</label>
                <input className="form-input" value={formData.tuition_uz} onChange={e => setFormData({...formData, tuition_uz: e.target.value})} required />
             </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Bekor qilish</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
