import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/translations';
import { programsAPI } from '../services/api';
import { 
  HiOutlineHome, 
  HiOutlineChevronRight, 
  HiOutlineAcademicCap, 
  HiOutlineTrophy, 
  HiOutlineBeaker,
  HiOutlineCalendar,
  HiOutlineUsers,
  HiOutlineBanknotes,
  HiOutlineBookOpen,
  HiOutlineArrowRight
} from 'react-icons/hi2';

export default function ProgramsPage() {
  const { lang } = useApp();
  const { t } = useTranslation(lang);
  const [programs, setPrograms] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    programsAPI.getAll().then(res => {
      setPrograms(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = activeTab === 'all' ? programs : programs.filter(p => p.level === activeTab);

  const tabs = [
    { key: 'all', label: t('common.all') },
    { key: 'bachelor', label: t('programs.bachelor') },
    { key: 'master', label: t('programs.master') },
  ];

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
              <span>{t('programs.title')}</span>
            </div>
            <h1>{t('programs.title')}</h1>
            <p>{t('programs.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-10)' }}>
            <div className="tab-list">
              {tabs.map(({ key, label }) => (
                <button key={key} className={`tab-btn ${activeTab === key ? 'active' : ''}`}
                  onClick={() => setActiveTab(key)}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading-state"><div className="spinner" /></div>
          ) : (
            <div className="grid-2">
              {filtered.map(prog => (
                <div key={prog.id} className={`program-card ${prog.level}`}>
                  <div className="program-level-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    {prog.level === 'bachelor' ? <HiOutlineAcademicCap /> : prog.level === 'master' ? <HiOutlineTrophy /> : <HiOutlineBeaker />}
                    {t(`programs.${prog.level}`)}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.05em', marginBottom: 'var(--space-1)' }}>
                    #{prog.code}
                  </div>
                  <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>
                    {prog[`name_${lang}`]}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
                    {prog[`description_${lang}`]}
                  </p>

                  {/* Info Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                    {[
                      { label: t('programs.duration'), val: prog[`duration_${lang}`], icon: <HiOutlineCalendar style={{ color: '#2563eb' }} /> },
                      { label: t('programs.seats'), val: prog.seats, icon: <HiOutlineUsers style={{ color: '#7c3aed' }} /> },
                      { label: t('programs.tuition'), val: prog[`tuition_${lang}`], icon: <HiOutlineBanknotes style={{ color: '#059669' }} /> },
                    ].map(({ label, val, icon }) => (
                      <div key={label} style={{
                        background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)',
                        padding: 'var(--space-4)', border: '1px solid var(--border-color)', textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{icon}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
                        <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>{val}</div>
                      </div>
                    ))}
                  </div>

                  {/* Key Courses & Teachers */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                    <div>
                      <h4 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 800, color: 'var(--text-muted)', marginBottom: 'var(--space-3)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <HiOutlineBookOpen style={{ fontSize: '1rem' }} /> {t('programs.courses')}
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                        {(prog[`courses_${lang}`] || []).map((c, i) => (
                          <span key={i} className="badge badge-blue" style={{ fontSize: '0.65rem' }}>{c}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontSize: 'var(--font-size-xs)', fontWeight: 800, color: 'var(--text-muted)', marginBottom: 'var(--space-3)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <HiOutlineUsers style={{ fontSize: '1rem' }} /> {t('programs.responsible_teachers')}
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                        {(prog.teachers || []).map((t, i) => (
                          <span key={i} className="badge badge-gold" style={{ fontSize: '0.65rem' }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Link to="/contact" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                    {t('programs.apply')} <HiOutlineArrowRight />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
