import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/translations';
import { newsAPI } from '../services/api';
import { 
  HiOutlineHome, 
  HiOutlineChevronRight, 
  HiOutlineCalendarDays, 
  HiOutlineEye,
  HiOutlineUser,
  HiOutlineArrowLeft
} from 'react-icons/hi2';
import { FaFacebookF, FaTwitter, FaWhatsapp } from 'react-icons/fa';

export default function NewsDetailPage() {
  const { id } = useParams();
  const { lang } = useApp();
  const { t } = useTranslation(lang);
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    setLoading(true);
    newsAPI.getById(id).then(res => {
      setNews(res.data);
      setLoading(false);
      // Fetch related news
      newsAPI.getAll({ limit: 3 }).then(relatedRes => {
        setRelated(relatedRes.data.filter(item => item.id !== parseInt(id)));
      });
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-state" style={{ minHeight: '80vh' }}><div className="spinner" /></div>;
  if (!news) return <div className="loading-state" style={{ minHeight: '80vh' }}><h3>Yangilik topilmadi</h3><Link to="/news" className="btn btn-primary mt-4">Yangiliklarga qaytish</Link></div>;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <HiOutlineHome style={{ fontSize: '1rem' }} /> {t('nav.home')}
            </Link>
            <span className="breadcrumb-sep"><HiOutlineChevronRight /></span>
            <Link to="/news">{t('news.title')}</Link>
            <span className="breadcrumb-sep"><HiOutlineChevronRight /></span>
            <span>{news[`title_${lang}`]}</span>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-primary)', marginTop: '-60px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-10)' }}>
            {/* Main Content */}
            <div className="card" style={{ padding: 'var(--space-10)' }}>
              <div className="news-meta" style={{ marginBottom: 'var(--space-6)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-5)' }}>
                <span className="badge badge-blue">{t(`news.categories.${news.category}`)}</span>
                <span className="news-date" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <HiOutlineCalendarDays style={{ color: 'var(--primary-600)' }} /> {news.published_at}
                </span>
                <span className="news-date" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <HiOutlineEye /> {news.views} {t('news.views')}
                </span>
                <span className="news-date" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <HiOutlineUser /> {news.author}
                </span>
              </div>

              <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 800, marginBottom: 'var(--space-8)', lineHeight: 1.2 }}>
                {news[`title_${lang}`]}
              </h1>

              <div style={{ marginBottom: 'var(--space-10)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                <img
                  src={news.image}
                  alt={news[`title_${lang}`]}
                  style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/1200x800?text=No+Image'; }}
                />
              </div>

              <div style={{
                color: 'var(--text-secondary)',
                fontSize: 'var(--font-size-lg)',
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap'
              }}>
                {news[`content_${lang}`]}
              </div>

              <div className="divider" />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/news" className="btn btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <HiOutlineArrowLeft /> {t('common.back')}
                </Link>
                 <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                   <button className="btn btn-sm" style={{ background: '#1877F2', color: 'white', display: 'flex', alignItems: 'center', gap: 6 }}><FaFacebookF /> Facebook</button>
                   <button className="btn btn-sm" style={{ background: '#1DA1F2', color: 'white', display: 'flex', alignItems: 'center', gap: 6 }}><FaTwitter /> Twitter</button>
                   <button className="btn btn-sm" style={{ background: '#25D366', color: 'white', display: 'flex', alignItems: 'center', gap: 6 }}><FaWhatsapp /> WhatsApp</button>
                 </div>
              </div>
            </div>

            {/* Sidebar */}
            <div>
              <h3 style={{ marginBottom: 'var(--space-6)', fontWeight: 700 }}>{lang === 'uz' ? 'Tavsiya etiladi' : 'Recommended'}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {related.map(item => (
                  <Link key={item.id} to={`/news/${item.id}`} style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ overflow: 'hidden' }}>
                      <img
                        src={item.image}
                        alt={item[`title_${lang}`]}
                        style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                      />
                      <div style={{ padding: 'var(--space-4)' }}>
                        <h4 style={{
                          fontSize: 'var(--font-size-sm)',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          marginBottom: 'var(--space-2)',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {item[`title_${lang}`]}
                        </h4>
                        <span className="news-date" style={{ fontSize: '10px', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <HiOutlineCalendarDays style={{ fontSize: '12px' }} /> {item.published_at}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="card" style={{ marginTop: 'var(--space-8)', padding: 'var(--space-6)', background: 'linear-gradient(135deg, var(--primary-600), var(--primary-800))', color: 'white' }}>
                <h4 style={{ marginBottom: 'var(--space-3)' }}>{lang === 'uz' ? 'Obuna bo\'ling' : 'Subscribe'}</h4>
                <p style={{ fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-4)', opacity: 0.8 }}>
                  {lang === 'uz' ? 'Kafedra yangiliklaridan birinchilardan bo\'lib xabardor bo\'ling.' : 'Be the first to know about department news.'}
                </p>
                <input className="form-input" style={{ marginBottom: 'var(--space-3)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }} placeholder="Email" />
                <button className="btn btn-accent btn-sm w-full">Obuna bo'lish</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
