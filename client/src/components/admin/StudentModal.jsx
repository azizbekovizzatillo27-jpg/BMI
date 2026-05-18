import { useState } from 'react';
import { studentsAPI } from '../../services/api';
import { HiOutlineXMark } from 'react-icons/hi2';

export default function StudentModal({ isOpen, onClose, mode, onSuccess, addToast }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title_uz: '',
    title_en: '',
    // for materials
    type: 'pdf',
    subject: '',
    author: '',
    // for theses
    student: '',
    year: new Date().getFullYear(),
    grade: 'A\'lo',
    advisor: ''
  });

  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'material') {
        const formDataToSend = new FormData();
        formDataToSend.append('title_uz', formData.title_uz);
        formDataToSend.append('title_en', formData.title_en);
        formDataToSend.append('subject', formData.subject);
        formDataToSend.append('author', formData.author);
        if (file) formDataToSend.append('file', file);
        
        await studentsAPI.createMaterial(formDataToSend);
        addToast('Material qo\'shildi', 'success');
      } else {
        await studentsAPI.createThesis(formData);
        addToast('Bitiruv ishi qo\'shildi', 'success');
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
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'material' ? 'Yangi o\'quv materiali' : 'Yangi bitiruv ishi'}</h2>
          <button className="modal-close" onClick={onClose}><HiOutlineXMark /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label className="form-label">Sarlavha (UZ)</label>
            <input className="form-input" value={formData.title_uz} onChange={e => setFormData({...formData, title_uz: e.target.value})} required />
          </div>

          <div className="form-group">
            <label className="form-label">Sarlavha (EN)</label>
            <input className="form-input" value={formData.title_en} onChange={e => setFormData({...formData, title_en: e.target.value})} required />
          </div>

          {mode === 'material' && (
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Fan</label>
                <input className="form-input" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="form-label">Muallif</label>
                <input className="form-input" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required />
              </div>
            </div>
          )}

          {mode === 'material' && (
            <div className="form-group">
              <label className="form-label">Fayl (PDF, DOC, DOCX)</label>
              <input 
                type="file" 
                className="form-input" 
                accept=".pdf,.doc,.docx" 
                onChange={e => setFile(e.target.files[0])} 
                required={!file}
              />
            </div>
          )}

          {mode !== 'material' && (
            <>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Talaba F.I.SH</label>
                  <input className="form-input" value={formData.student} onChange={e => setFormData({...formData, student: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Yil</label>
                  <input type="number" className="form-input" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Ilmiy rahbar</label>
                <input className="form-input" value={formData.advisor} onChange={e => setFormData({...formData, advisor: e.target.value})} required />
              </div>
            </>
          )}

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Bekor qilish</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Yuklanmoqda...' : 'Qo\'shish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
