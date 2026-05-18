import { useState } from 'react';
import { galleryAPI } from '../../services/api';
import { HiOutlineXMark, HiOutlineCloudArrowUp } from 'react-icons/hi2';

export default function GalleryModal({ isOpen, onClose, onSuccess, addToast }) {
  const [formData, setFormData] = useState({
    title_uz: '',
    title_ru: '',
    title_en: '',
    category: 'events'
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      addToast('Iltimos, rasm tanlang', 'error');
      return;
    }
    setLoading(true);

    const data = new FormData();
    data.append('title_uz', formData.title_uz);
    data.append('title_ru', formData.title_ru);
    data.append('title_en', formData.title_en);
    data.append('category', formData.category);
    data.append('image', image);

    try {
      await galleryAPI.create(data);
      addToast('Rasm muvaffaqiyatli yuklandi', 'success');
      onSuccess();
      onClose();
      // Reset form
      setFormData({ title_uz: '', title_ru: '', title_en: '', category: 'events' });
      setImage(null);
      setPreview('');
    } catch (err) {
      addToast('Yuklashda xatolik yuz berdi: ' + (err.response?.data?.error || err.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800 }}>Rasm yuklash</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><HiOutlineXMark /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-muted uppercase mb-2 block">Tavsif (UZ)</label>
            <input required className="input w-full" value={formData.title_uz} onChange={e => setFormData({ ...formData, title_uz: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-bold text-muted uppercase mb-2 block">Описание (RU)</label>
            <input className="input w-full" value={formData.title_ru} onChange={e => setFormData({ ...formData, title_ru: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-bold text-muted uppercase mb-2 block">Description (EN)</label>
            <input className="input w-full" value={formData.title_en} onChange={e => setFormData({ ...formData, title_en: e.target.value })} />
          </div>
          
          <div>
            <label className="text-xs font-bold text-muted uppercase mb-2 block">Rasm</label>
            <div 
              style={{ 
                height: '200px', border: '2px dashed var(--border-color)', 
                borderRadius: 'var(--radius-xl)', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden'
              }}
              onClick={() => document.getElementById('gallery-image').click()}
            >
              {preview ? (
                <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  <HiOutlineCloudArrowUp style={{ fontSize: '2rem' }} />
                  <p className="text-xs mt-2">Bosing va rasm tanlang</p>
                </div>
              )}
              <input id="gallery-image" type="file" hidden accept="image/*" onChange={handleImageChange} />
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button type="button" className="btn btn-ghost flex-1" onClick={onClose}>Bekor qilish</button>
            <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
              {loading ? 'Yuklanmoqda...' : 'Yuklash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
