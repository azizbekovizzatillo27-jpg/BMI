import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/translations';
import { researchAPI } from '../services/api';
import { 
  HiOutlineHome, 
  HiOutlineChevronRight, 
  HiOutlineCalendar, 
  HiOutlineArrowDownTray,
  HiOutlineDocumentText,
  HiOutlineLightBulb,
  HiOutlineBeaker,
  HiOutlineAcademicCap
} from 'react-icons/hi2';

export default function ResearchPage() {
  const { lang } = useApp();
  const { t } = useTranslation(lang);
  const [research, setResearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('all');

  const types = ['all', 'article', 'project', 'dissertation', 'patent'];

  useEffect(() => {
    setLoading(true);
    const params = activeType === 'all' ? {} : { type: activeType };
    researchAPI.getAll(params).then(res => {
      setResearch(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [activeType]);

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
              <span>{t('research.title')}</span>
            </div>
            <h1>{t('research.title')}</h1>
            <p>{t('research.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          {/* Research Type Toggles */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-10)' }}>
            <div className="tab-list">
              {types.map(type => (
                <button
                  key={type}
                  className={`tab-btn ${activeType === type ? 'active' : ''}`}
                  onClick={() => setActiveType(type)}
                >
                  {t(`research.types.${type}`)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading-state"><div className="spinner" /></div>
          ) : research.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {research.map(item => (
                <div key={item.id} className="card animate-fadeInUp" style={{ padding: 'var(--space-8)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                    <div style={{ flex: 1 }}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`badge ${item.type === 'project' ? 'badge-gold' : item.type === 'article' ? 'badge-blue' : 'badge-green'}`}>
                          {t(`research.types.${item.type}`)}
                        </span>
                        <span className={`badge ${item.status === 'published' ? 'badge-green' : 'badge-gold'}`}>
                          {t(`research.${item.status}`)}
                        </span>
                        <span className="text-sm font-bold text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <HiOutlineCalendar style={{ fontSize: '1rem' }} /> {item.year}
                        </span>
                      </div>
                      <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
                        {item[`title_${lang}`]}
                      </h2>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-base)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
                        {item[`description_${lang}`]}
                      </p>
                    </div>

                    <div style={{ minWidth: '200px', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                      {item.doi && (
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--primary-600)', wordBreak: 'break-all' }}>
                          <strong>DOI:</strong> {item.doi}
                        </div>
                      )}
                      {item.journal && (
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                          <strong>{t('research.journal')}:</strong> {item.journal}
                        </div>
                      )}
                      {item.funding_uz && (
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                          <strong>{t('research.funding')}:</strong> {item[`funding_${lang}`]}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="divider" style={{ margin: 'var(--space-4) 0' }} />

                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700 }}>{t('research.authors')}:</span>
                      <div className="flex flex-wrap gap-2">
                        {item.authors.map((author, i) => (
                          <span key={i} className="text-primary-color font-semibold text-sm">
                            {author}{i < item.authors.length - 1 ? ',' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                    {item.type === 'article' && (
                      <button className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        {t('research.download_pdf')} <HiOutlineArrowDownTray />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="loading-state">
              <p>{t('research.no_data')}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
