import { useState, useEffect } from 'react';
import { staffAPI } from '../../services/api';
import { HiOutlineXMark, HiOutlineCloudArrowUp } from 'react-icons/hi2';

export default function StaffModal({ isOpen, onClose, staffItem, onSuccess, addToast }) {
  const [formData, setFormData] = useState({
    name_uz: '',
    name_ru: '',
    name_en: '',
    position_uz: '',
    position_ru: '',
    position_en: '',
    degree_uz: '',
    degree_ru: '',
    degree_en: '',
    email: '',
    phone: '',
    articles: 0,
    experience: 0,
    bio_uz: '',
    bio_ru: '',
    bio_en: ''
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (staffItem) {
      setFormData({
        name_uz: staffItem.name_uz || '',
        name_ru: staffItem.name_ru || '',
        name_en: staffItem.name_en || '',
        position_uz: staffItem.position_uz || '',
        position_ru: staffItem.position_ru || '',
        position_en: staffItem.position_en || '',
        degree_uz: staffItem.degree_uz || '',
        degree_ru: staffItem.degree_ru || '',
        degree_en: staffItem.degree_en || '',
        email: staffItem.email || '',
        phone: staffItem.phone || '',
        articles: staffItem.articles || 0,
        experience: staffItem.experience || 0,
        bio_uz: staffItem.bio_uz || '',
        bio_ru: staffItem.bio_ru || '',
        bio_en: staffItem.bio_en || ''
      });
      setPreview(staffItem.photo || '');
    } else {
      setFormData({
        name_uz: '', name_ru: '', name_en: '', 
        position_uz: '', position_ru: '', position_en: '',
        degree_uz: '', degree_ru: '', degree_en: '', 
        email: '', phone: '',
        articles: 0, experience: 0, 
        bio_uz: '', bio_ru: '', bio_en: ''
      });
      setPreview('');
      setPhoto(null);
    }
  }, [staffItem, isOpen]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    if (photo) {
      data.append('photo', photo);
    }

    try {
      if (staffItem) {
        await staffAPI.update(staffItem.id, data);
        addToast('Ma\'lumotlar muvaffaqiyatli yangilandi', 'success');
      } else {
        await staffAPI.create(data);
        addToast('Yangi xodim muvaffaqiyatli qo\'shildi', 'success');
      }
      onSuccess();
      onClose();
    } catch (err) {
      addToast('Xatolik yuz berdi: ' + (err.response?.data?.error || err.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800 }}>
            {staffItem ? 'Xodim ma\'lumotlarini tahrirlash' : 'Yangi xodim qo\'shish'}
          </h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><HiOutlineXMark /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid-2">
             <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-muted uppercase mb-2 block">F.I.SH (UZ)</label>
                  <input required className="input w-full" value={formData.name_uz} onChange={e => setFormData({ ...formData, name_uz: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted uppercase mb-2 block">Ф.И.О (RU)</label>
                  <input className="input w-full" value={formData.name_ru} onChange={e => setFormData({ ...formData, name_ru: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted uppercase mb-2 block">Full Name (EN)</label>
                  <input className="input w-full" value={formData.name_en} onChange={e => setFormData({ ...formData, name_en: e.target.value })} />
                </div>
             </div>
             <div>
                <label className="text-xs font-bold text-muted uppercase mb-2 block">Rasm (Kvadrat shaklda tavsiya etiladi)</label>
                <div 
                  style={{ 
                    height: '144px', border: '2px dashed var(--border-color)', 
                    borderRadius: 'var(--radius-xl)', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden'
                  }}
                  onClick={() => document.getElementById('staff-photo').click()}
                >
                  {preview ? (
                    <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <HiOutlineCloudArrowUp style={{ fontSize: '2rem', opacity: 0.3 }} />
                  )}
                  <input id="staff-photo" type="file" hidden accept="image/*" onChange={handlePhotoChange} />
                </div>
             </div>
          </div>

          <div className="grid-3">
            <div>
              <label className="text-xs font-bold text-muted uppercase mb-2 block">Lavozim (UZ)</label>
              <input required className="input w-full" value={formData.position_uz} onChange={e => setFormData({ ...formData, position_uz: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-bold text-muted uppercase mb-2 block">Должность (RU)</label>
              <input className="input w-full" value={formData.position_ru} onChange={e => setFormData({ ...formData, position_ru: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-bold text-muted uppercase mb-2 block">Position (EN)</label>
              <input className="input w-full" value={formData.position_en} onChange={e => setFormData({ ...formData, position_en: e.target.value })} />
            </div>
          </div>

          <div className="grid-3">
            <div>
              <label className="text-xs font-bold text-muted uppercase mb-2 block">Ilmiy daraja (UZ)</label>
              <input className="input w-full" value={formData.degree_uz} onChange={e => setFormData({ ...formData, degree_uz: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-bold text-muted uppercase mb-2 block">Ученая степень (RU)</label>
              <input className="input w-full" value={formData.degree_ru} onChange={e => setFormData({ ...formData, degree_ru: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-bold text-muted uppercase mb-2 block">Degree (EN)</label>
              <input className="input w-full" value={formData.degree_en} onChange={e => setFormData({ ...formData, degree_en: e.target.value })} />
            </div>
          </div>

          <div className="grid-3">
            <div>
              <label className="text-xs font-bold text-muted uppercase mb-2 block">Email</label>
              <input type="email" required className="input w-full" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-bold text-muted uppercase mb-2 block">Telefon</label>
              <input className="input w-full" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-bold text-muted uppercase mb-2 block">Maqolalar soni</label>
              <input type="number" className="input w-full" value={formData.articles} onChange={e => setFormData({ ...formData, articles: e.target.value })} />
            </div>
          </div>

          <div className="grid-3">
            <div>
              <label className="text-xs font-bold text-muted uppercase mb-2 block">Biografiya (UZ)</label>
              <textarea className="input w-full" style={{ minHeight: '100px' }} value={formData.bio_uz} onChange={e => setFormData({ ...formData, bio_uz: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-bold text-muted uppercase mb-2 block">Биография (RU)</label>
              <textarea className="input w-full" style={{ minHeight: '100px' }} value={formData.bio_ru} onChange={e => setFormData({ ...formData, bio_ru: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-bold text-muted uppercase mb-2 block">Biography (EN)</label>
              <textarea className="input w-full" style={{ minHeight: '100px' }} value={formData.bio_en} onChange={e => setFormData({ ...formData, bio_en: e.target.value })} />
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button type="button" className="btn btn-ghost flex-1" onClick={onClose}>Bekor qilish</button>
            <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
              {loading ? 'Saqlanmoqda...' : (staffItem ? 'Yangilash' : 'Saqlash')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
