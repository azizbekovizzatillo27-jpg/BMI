import { useState, useEffect } from 'react';
import { researchAPI } from '../../services/api';
import { HiOutlineXMark } from 'react-icons/hi2';

export default function ResearchModal({ isOpen, onClose, research, onSuccess, addToast }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title_uz: '',
    title_ru: '',
    title_en: '',
    authors: '',
    year: new Date().getFullYear(),
    type: 'article',
    status: 'published',
    journal: '',
    doi: '',
    description_uz: '',
    description_ru: '',
    description_en: ''
  });

  useEffect(() => {
    if (research) {
      setFormData({
        ...research,
        authors: Array.isArray(research.authors) ? research.authors.join(', ') : research.authors
      });
    } else {
      setFormData({
        title_uz: '',
        title_ru: '',
        title_en: '',
        authors: '',
        year: new Date().getFullYear(),
        type: 'article',
        status: 'published',
        journal: '',
        doi: '',
        description_uz: '',
        description_ru: '',
        description_en: ''
      });
    }
  }, [research, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        authors: formData.authors.split(',').map(a => a.trim())
      };
      
      if (research) {
        await researchAPI.update(research.id, dataToSend);
        addToast('Muvaffaqiyatli yangilandi', 'success');
      } else {
        await researchAPI.create(dataToSend);
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
          <h2>{research ? 'Ilmiy ishni tahrirlash' : 'Yangi ilmiy ish qo\'shish'}</h2>
          <button className="modal-close" onClick={onClose}><HiOutlineXMark /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label className="form-label">Sarlavha (UZ)</label>
            <input className="form-input" value={formData.title_uz} onChange={e => setFormData({...formData, title_uz: e.target.value})} required />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Turi</label>
              <select className="form-input" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="article">Maqola</option>
                <option value="project">Loyiha</option>
                <option value="patent">Patent</option>
                <option value="dissertation">Dissertatsiya</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Yil</label>
              <input type="number" className="form-input" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mualliflar (vergul bilan ajrating)</label>
            <input className="form-input" value={formData.authors} onChange={e => setFormData({...formData, authors: e.target.value})} placeholder="Aliyev V., Karimov N." required />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Jurnal / Nashriyot</label>
              <input className="form-input" value={formData.journal} onChange={e => setFormData({...formData, journal: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">DOI / Havola</label>
              <input className="form-input" value={formData.doi} onChange={e => setFormData({...formData, doi: e.target.value})} />
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
