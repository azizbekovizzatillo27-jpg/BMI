import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/translations';
import { galleryAPI, getImageUrl } from '../services/api';
import { 
  HiOutlineHome, 
  HiOutlineChevronRight, 
  HiXMark,
  HiOutlinePhoto
} from 'react-icons/hi2';

export default function GalleryPage() {
  const { lang } = useApp();
  const { t } = useTranslation(lang);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxImage, setLightboxImage] = useState(null);

  const categories = ['all', 'events', 'conference', 'seminar', 'study', 'team'];

  useEffect(() => {
    setLoading(true);
    const params = activeCategory === 'all' ? {} : { category: activeCategory };
    galleryAPI.getAll(params).then(res => {
      setImages(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [activeCategory]);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <div className="breadcrumb">
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <HiOutlineHome style={{ fontSize: '1rem' }} /> {t('nav.home')}
              </Link>
              <span className="breadcrumb-sep"><HiOutlineChevronRight /></span>
              <span>{t('gallery.title')}</span>
            </div>
            <h1>{t('gallery.title')}</h1>
            <p>{t('gallery.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          {/* Category Filter */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-10)', overflowX: 'auto', paddingBottom: 'var(--space-2)' }}>
            <div className="tab-list">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {t(`gallery.categories.${cat}`)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading-state"><div className="spinner" /></div>
          ) : images.length > 0 ? (
            <div className="gallery-grid animate-fadeInUp">
              {images.map(item => (
                <div key={item.id} className="gallery-item" onClick={() => setLightboxImage(item)}>
                  <img src={getImageUrl(item.image)} alt={item[`title_${lang}`]} loading="lazy" />
                  <div className="gallery-overlay">
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="badge badge-gold mb-2" style={{ width: 'fit-content' }}>
                        {t(`gallery.categories.${item.category}`)}
                      </span>
                      <h4 className="gallery-title">{item[`title_${lang}`]}</h4>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px' }}>{item.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="loading-state" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <HiOutlinePhoto style={{ fontSize: '3rem', color: 'var(--text-muted)' }} />
              <p>{t('gallery.no_images')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div className="modal-overlay" onClick={() => setLightboxImage(null)}>
          <div className="modal-content" style={{ maxWidth: '900px', padding: 0, position: 'relative' }} onClick={e => e.stopPropagation()}>
             <button
               onClick={() => setLightboxImage(null)}
               style={{
                 position: 'absolute', top: '10px', right: '10px',
                 background: 'rgba(0,0,0,0.5)', color: 'white',
                 border: 'none', borderRadius: '50%',
                 width: '40px', height: '40px', cursor: 'pointer',
                 zIndex: 10, fontSize: '20px',
                 display: 'flex', alignItems: 'center', justifyContent: 'center'
               }}
             >
               <HiXMark />
             </button>
            <img
              src={getImageUrl(lightboxImage.image)}
              alt={lightboxImage[`title_${lang}`]}
              style={{ width: '100%', display: 'block', borderRadius: 'var(--radius-2xl)' }}
            />
            <div style={{ padding: 'var(--space-6)', background: 'var(--bg-card)' }}>
              <div className="flex items-center gap-3 mb-2">
                <span className="badge badge-gold">{t(`gallery.categories.${lightboxImage.category}`)}</span>
                <span className="text-sm text-muted">{lightboxImage.date}</span>
              </div>
              <h3 style={{ fontWeight: 800 }}>{lightboxImage[`title_${lang}`]}</h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
