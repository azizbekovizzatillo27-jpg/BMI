import { useState, useEffect } from 'react';
import { newsAPI } from '../../services/api';
import { HiOutlineXMark, HiOutlineCloudArrowUp } from 'react-icons/hi2';

export default function NewsModal({ isOpen, onClose, newsItem, onSuccess, addToast }) {
  const [formData, setFormData] = useState({
    title_uz: '',
    title_ru: '',
    title_en: '',
    content_uz: '',
    content_ru: '',
    content_en: '',
    category: 'news',
    author: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (newsItem) {
      setFormData({
        title_uz: newsItem.title_uz || '',
        title_ru: newsItem.title_ru || '',
        title_en: newsItem.title_en || '',
        content_uz: newsItem.content_uz || '',
        content_ru: newsItem.content_ru || '',
        content_en: newsItem.content_en || '',
        category: newsItem.category || 'news',
        author: newsItem.author || ''
      });
      setPreview(newsItem.image || '');
    } else {
      setFormData({
        title_uz: '',
        title_ru: '',
        title_en: '',
        content_uz: '',
        content_ru: '',
        content_en: '',
        category: 'news',
        author: ''
      });
      setPreview('');
      setImage(null);
    }
  }, [newsItem, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
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
    if (image) {
      data.append('image', image);
    }

    try {
      if (newsItem) {
        await newsAPI.update(newsItem.id, data);
        addToast('Yangilik muvaffaqiyatli tahrirlandi', 'success');
      } else {
        await newsAPI.create(data);
        addToast('Yangi yangilik muvaffaqiyatli qo\'shildi', 'success');
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
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800 }}>
            {newsItem ? 'Yangilikni tahrirlash' : 'Yangi yangilik qo\'shish'}
          </h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><HiOutlineXMark /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid-3">
            <div>
              <label className="text-xs font-bold text-muted uppercase mb-2 block">Sarlavha (UZ)</label>
              <input
                required
                className="input w-full"
                value={formData.title_uz}
                onChange={e => setFormData({ ...formData, title_uz: e.target.value })}
                placeholder="O'zbekcha sarlavha"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted uppercase mb-2 block">Заголовок (RU)</label>
              <input
                required
                className="input w-full"
                value={formData.title_ru}
                onChange={e => setFormData({ ...formData, title_ru: e.target.value })}
                placeholder="Заголовок на русском"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted uppercase mb-2 block">Title (EN)</label>
              <input
                required
                className="input w-full"
                value={formData.title_en}
                onChange={e => setFormData({ ...formData, title_en: e.target.value })}
                placeholder="English title"
              />
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label className="text-xs font-bold text-muted uppercase mb-2 block">Kategoriya</label>
              <select
                className="input w-full"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="news">Yangilik</option>
                <option value="conference">Konferensiya</option>
                <option value="achievement">Yutuq</option>
                <option value="seminar">Seminar</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-muted uppercase mb-2 block">Muallif</label>
              <input
                required
                className="input w-full"
                value={formData.author}
                onChange={e => setFormData({ ...formData, author: e.target.value })}
                placeholder="Ism-sharif yoki bo'lim"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted uppercase mb-2 block">Matn (UZ)</label>
            <textarea
              required
              className="input w-full"
              style={{ minHeight: '100px' }}
              value={formData.content_uz}
              onChange={e => setFormData({ ...formData, content_uz: e.target.value })}
              placeholder="O'zbekcha to'liq matn..."
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted uppercase mb-2 block">Текст (RU)</label>
            <textarea
              required
              className="input w-full"
              style={{ minHeight: '100px' }}
              value={formData.content_ru}
              onChange={e => setFormData({ ...formData, content_ru: e.target.value })}
              placeholder="Полный текст на русском..."
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted uppercase mb-2 block">Text (EN)</label>
            <textarea
              required
              className="input w-full"
              style={{ minHeight: '100px' }}
              value={formData.content_en}
              onChange={e => setFormData({ ...formData, content_en: e.target.value })}
              placeholder="Full text in English..."
            />
          </div>

          <div>
            <label className="text-xs font-bold text-muted uppercase mb-2 block">Rasm</label>
            <div 
              style={{ 
                border: '2px dashed var(--border-color)', 
                borderRadius: 'var(--radius-xl)', 
                padding: 'var(--space-6)',
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative'
              }}
              onClick={() => document.getElementById('news-image').click()}
            >
              {preview ? (
                <img src={preview} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }} />
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>
                  <HiOutlineCloudArrowUp style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }} />
                  <p>Rasm yuklash uchun bosing</p>
                </div>
              )}
              <input
                id="news-image"
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button type="button" className="btn btn-ghost flex-1" onClick={onClose}>Bekor qilish</button>
            <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
              {loading ? 'Saqlanmoqda...' : (newsItem ? 'Yangilash' : 'Saqlash')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
