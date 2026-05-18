import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/translations';
import { newsAPI, getImageUrl } from '../services/api';
import { 
  HiOutlineHome, 
  HiOutlineChevronRight, 
  HiOutlineCalendarDays, 
  HiOutlineEye,
  HiOutlineArrowRight
} from 'react-icons/hi2';

export default function NewsPage() {
  const { lang } = useApp();
  const { t } = useTranslation(lang);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = ['all', 'news', 'conference', 'seminar', 'achievement', 'announcement'];

  useEffect(() => {
    setLoading(true);
    const params = activeCategory === 'all' ? {} : { category: activeCategory };
    newsAPI.getAll(params).then(res => {
      setNews(res.data);
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
              <span>{t('news.title')}</span>
            </div>
            <h1>{t('news.title')}</h1>
            <p>{t('news.subtitle')}</p>
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
                  {t(`news.categories.${cat}`)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading-state"><div className="spinner" /></div>
          ) : news.length > 0 ? (
            <div className="grid-3">
              {news.map(item => (
                <div key={item.id} className="news-card animate-fadeInUp">
                  <div className="news-img-wrapper">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item[`title_${lang}`]}
                      className="news-card-img"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=No+Image'; }}
                    />
                  </div>
                  <div className="news-card-body">
                     <div className="news-meta">
                       <span className="badge badge-blue">{t(`news.categories.${item.category}`)}</span>
                       <span className="news-date" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                         <HiOutlineCalendarDays style={{ color: 'var(--primary-600)' }} /> {item.published_at}
                       </span>
                     </div>
                    <h3 className="news-title">{item[`title_${lang}`]}</h3>
                    <p className="news-excerpt">{item[`content_${lang}`]}</p>
                    <div className="news-footer">
                       <span className="news-date" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                         <HiOutlineEye /> {item.views} {t('news.views')}
                       </span>
                       <Link to={`/news/${item.id}`} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                         {t('news.read_more')} <HiOutlineArrowRight />
                       </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="loading-state">
              <p>{t('news.no_news')}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
