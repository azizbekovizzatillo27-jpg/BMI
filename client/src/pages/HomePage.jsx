import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/translations';
import { newsAPI, statsAPI } from '../services/api';
import { 
  HiOutlineAcademicCap, 
  HiOutlineBeaker, 
  HiOutlineBriefcase, 
  HiOutlineGlobeAlt, 
  HiOutlineTrophy, 
  HiOutlineSignal,
  HiOutlineCalendar,
  HiOutlineUsers,
  HiOutlineBookOpen,
  HiOutlineNewspaper,
  HiOutlineEnvelope,
  HiOutlineBuildingLibrary,
  HiOutlineArrowRight,
  HiOutlineEye,
  HiOutlineChatBubbleOvalLeftEllipsis
} from 'react-icons/hi2';

const CountUp = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <>{count.toLocaleString()}</>;
};

const SliderItem = ({ item, lang }) => (
  <div style={{
    position: 'relative', minHeight: 500, borderRadius: 'var(--radius-2xl)',
    overflow: 'hidden', display: 'flex', alignItems: 'flex-end'
  }}>
    <img src={item.image} alt={item[`title_${lang}`]}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)'
    }} />
    <div style={{ position: 'relative', padding: 'var(--space-8)', zIndex: 1 }}>
      <span className="badge badge-gold" style={{ marginBottom: 'var(--space-3)' }}>
        {item.category}
      </span>
      <h3 style={{ color: 'white', fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-3)', lineHeight: 1.3 }}>
        {item[`title_${lang}`]}
      </h3>
      <Link to={`/news/${item.id}`} className="btn btn-accent btn-sm">
        {useTranslation(lang).t('common.read_more_btn')} →
      </Link>
    </div>
  </div>
);

export default function HomePage() {
  const { lang } = useApp();
  const { t } = useTranslation(lang);
  const [news, setNews] = useState([]);
  const [stats, setStats] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, statsRes] = await Promise.all([
          newsAPI.getAll({ limit: 6 }),
          statsAPI.getAll()
        ]);
        setNews(newsRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (news.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % Math.min(news.length, 4));
    }, 5000);
    return () => clearInterval(timer);
  }, [news.length]);

  const whyChooseUs = t('home.why_us_items').map((item, i) => ({
    ...item,
    icon: [
      <HiOutlineAcademicCap />, 
      <HiOutlineBeaker />, 
      <HiOutlineBriefcase />, 
      <HiOutlineGlobeAlt />, 
      <HiOutlineTrophy />, 
      <HiOutlineSignal />
    ][i]
  }));

  const quickLinks = [
    { icon: <HiOutlineCalendar />, label: t('nav.schedule'), to: '/schedule', color: '#2563eb' },
    { icon: <HiOutlineUsers />, label: t('nav.staff'), to: '/staff', color: '#7c3aed' },
    { icon: <HiOutlineBookOpen />, label: t('nav.programs'), to: '/programs', color: '#059669' },
    { icon: <HiOutlineNewspaper />, label: t('nav.news'), to: '/news', color: '#dc2626' },
    { icon: <HiOutlineBeaker />, label: t('nav.research'), to: '/research', color: '#d97706' },
    { icon: <HiOutlineEnvelope />, label: t('nav.contact'), to: '/contact', color: '#06b6d4' },
  ];

  return (
    <>
      {/* ---- HERO ---- */}
      <section className="hero overflow-hidden" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', position: 'relative', paddingTop: '80px' }}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
            <div className="hero-blob" style={{ 
                top: '-10%', left: '-5%', width: '40vw', height: '40vw', 
                background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
                animation: 'adminPulse 15s infinite alternate' 
            }} />
            <div className="hero-blob" style={{ 
                bottom: '10%', right: '5%', width: '35vw', height: '35vw', 
                background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
                animation: 'adminPulse 12s infinite alternate-reverse' 
            }} />
        </div>

        <div className="container relative" style={{ zIndex: 1 }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="animate-slide-up">
                <div className="section-badge mb-6" style={{ width: 'fit-content' }}>
                   ⚡ {t('home.hero_badge') || 'Innovatsion Ta\'lim'}
                </div>
                <h1 className="hero-title" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.05, fontWeight: 950, letterSpacing: '-0.02em' }}>
                  {t('home.hero_title')}<br/>
                  <span className="gradient-text">{t('home.hero_title_gradient')}</span>
                </h1>
                <p className="hero-subtitle mt-8 text-lg lg:text-xl opacity-80 max-w-xl" style={{ lineHeight: 1.8 }}>
                  {t('home.hero_subtitle')}
                </p>
                <div className="hero-actions mt-12 flex flex-wrap gap-5">
                  <Link to="/about" className="auth-submit-btn" style={{ marginTop: 0, padding: '18px 40px', borderRadius: 20, width: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <HiOutlineBuildingLibrary style={{ fontSize: '1.4rem' }} /> {t('home.hero_btn_primary')}
                  </Link>
                  <Link to="/staff" className="btn-lg" style={{ 
                    padding: '18px 40px', borderRadius: 20, 
                    background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                    backdropFilter: 'blur(20px)', color: 'var(--text-primary)',
                    display: 'flex', alignItems: 'center', gap: 12, fontWeight: 700,
                    transition: 'all 0.3s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseOut={e => e.currentTarget.style.background = 'var(--glass-bg)'}
                  >
                    <HiOutlineUsers style={{ fontSize: '1.4rem' }} /> {t('home.hero_btn_secondary')}
                  </Link>
                </div>

                {/* Premium Animated Stats */}
                <div className="grid-3 mt-14" style={{ gap: '1rem' }}>
                  {stats && [
                    { val: stats.students, label: t('home.stats_students'), icon: <HiOutlineUsers />, color: '#3b82f6', glow: 'rgba(59,130,246,0.4)' },
                    { val: stats.teachers, label: t('home.stats_teachers'), icon: <HiOutlineAcademicCap />, color: '#10b981', glow: 'rgba(16,185,129,0.4)' },
                    { val: stats.graduates, label: t('home.stats_graduates'), icon: <HiOutlineTrophy />, color: '#f59e0b', glow: 'rgba(245,158,11,0.4)' },
                  ].map(({ val, label, icon, color, glow }, i) => (
                    <div key={i} style={{
                      position: 'relative',
                      padding: '20px 14px',
                      borderRadius: 20,
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${color}50`,
                      backdropFilter: 'blur(16px)',
                      overflow: 'hidden',
                      textAlign: 'center',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      cursor: 'default',
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = `0 16px 40px ${glow}`;
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    >
                      <div style={{
                        position: 'absolute', bottom: -24, left: '50%', transform: 'translateX(-50%)',
                        width: 80, height: 80, borderRadius: '50%',
                        background: glow, filter: 'blur(28px)', zIndex: 0
                      }} />
                      <div style={{
                        position: 'relative', zIndex: 1,
                        width: 46, height: 46, borderRadius: 14,
                        background: `${color}20`, border: `1.5px solid ${color}50`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.4rem', color: color,
                        margin: '0 auto 12px'
                      }}>
                        {icon}
                      </div>
                      <div style={{
                        position: 'relative', zIndex: 1,
                        fontSize: '2rem', fontWeight: 900, lineHeight: 1,
                        color: color, letterSpacing: '-0.03em'
                      }}>
                        <CountUp end={val} /><span style={{ fontSize: '1.1rem' }}>+</span>
                      </div>
                      <div style={{
                        position: 'relative', zIndex: 1,
                        fontSize: '0.62rem', fontWeight: 700,
                        color: 'rgba(255,255,255,0.5)',
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                        marginTop: 7
                      }}>
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              {loading ? (
                <div className="admin-table-container aspect-square flex items-center justify-center">
                  <div className="loading-spinner" />
                </div>
              ) : news.length > 0 ? (
                <div className="relative animate-slide-in">
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <SliderItem item={news[currentSlide]} lang={lang} />
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute -inset-4 bg-primary/5 rounded-[40px] -z-1 blur-2xl" />
                  <div className="flex justify-center gap-2 mt-6">
                    {news.slice(0, 4).map((_, i) => (
                      <button key={i} onClick={() => setCurrentSlide(i)} style={{
                        width: i === currentSlide ? 32 : 8,
                        height: 8, borderRadius: 4,
                        background: i === currentSlide ? 'var(--primary-600)' : 'var(--border-color)',
                        border: 'none', cursor: 'pointer',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                      }} />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* ---- QUICK LINKS ---- */}
      <section className="section-sm" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 style={{
            textAlign: 'center',
            fontSize: 'var(--font-size-lg)',
            fontWeight: 700,
            color: 'var(--text-secondary)',
            marginBottom: 'var(--space-6)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}>{t('home.quick_links')}</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 'var(--space-4)'
          }}>
            {quickLinks.map(({ icon, label, to, color }) => (
              <Link key={to} to={to} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-3)',
                padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)',
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                transition: 'all 0.25s', textDecoration: 'none', color: 'var(--text-primary)'
              }}
                onMouseOver={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = color;
                  e.currentTarget.style.boxShadow = `0 8px 25px ${color}30`;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span style={{
                  width: 52, height: 52, borderRadius: 'var(--radius-xl)',
                  background: `${color}15`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.5rem'
                }}>{icon}</span>
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, textAlign: 'center' }}>
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---- LATEST NEWS ---- */}
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <HiOutlineNewspaper style={{ fontSize: '1.1rem' }} /> {t('nav.news')}
            </div>
            <h2 className="section-title">{t('home.latest_news')}</h2>
          </div>

          {loading ? (
            <div className="loading-state"><div className="spinner" /></div>
          ) : (
            <>
              <div className="grid-3">
                {news.slice(0, 3).map(item => (
                  <div key={item.id} className="news-card">
                    <div className="news-img-wrapper">
                      <img src={item.image} alt={item[`title_${lang}`]} className="news-card-img" />
                    </div>
                    <div className="news-card-body">
                      <div className="news-meta">
                        <span className="badge badge-blue">{item.category}</span>
                        <span className="news-date" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <HiOutlineCalendar style={{ fontSize: '1rem' }} /> {item.published_at}
                        </span>
                      </div>
                      <h3 className="news-title">{item[`title_${lang}`]}</h3>
                      <p className="news-excerpt">{item[`content_${lang}`]}</p>
                      <div className="news-footer">
                        <span className="news-date" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <HiOutlineEye style={{ fontSize: '1.1rem' }} /> {item.views} {t('news.views')}
                        </span>
                        <Link to={`/news/${item.id}`} className="btn btn-primary btn-sm">
                          {t('news.read_more')} <HiOutlineArrowRight style={{ marginLeft: 6 }} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
                <Link to="/news" className="btn btn-secondary btn-lg">
                  {t('home.view_all')} →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ---- WHY CHOOSE US ---- */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <HiOutlineTrophy style={{ fontSize: '1.1rem' }} /> {t('home.why_us')}
            </div>
            <h2 className="section-title">{t('home.why_us')}</h2>
            <p className="section-subtitle">{t('home.why_us_sub')}</p>
          </div>
          <div className="grid-3">
            {whyChooseUs.map(({ icon, title, desc }, i) => (
              <div key={i} className="card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
                <div style={{
                  width: 70, height: 70, borderRadius: 'var(--radius-xl)',
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(245,158,11,0.1))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', margin: '0 auto var(--space-5)',
                  border: '1px solid var(--border-color)'
                }}>
                  {icon}
                </div>
                <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
                  {title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.7 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- PARTNERS / CTA ---- */}
      <section className="section" style={{
        background: 'linear-gradient(135deg, #0f172a, #1e3a8a)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(37,99,235,0.2) 0%, transparent 70%)'
        }} />
        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <div className="section-badge" style={{
            background: 'rgba(245,158,11,0.15)',
            borderColor: 'rgba(245,158,11,0.3)',
            color: '#fbbf24',
            display: 'inline-flex', alignItems: 'center', gap: 8
          }}>
            <HiOutlineAcademicCap style={{ fontSize: '1.1rem' }} /> {t('home.cta_badge')}
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: 'white', fontWeight: 900, marginBottom: 'var(--space-6)', marginTop: 'var(--space-4)'
          }}>
            {t('home.cta_title')}
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.6)', fontSize: 'var(--font-size-xl)',
            maxWidth: 600, margin: '0 auto var(--space-10)', lineHeight: 1.7
          }}>
            {t('home.cta_subtitle')}
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/programs" className="btn btn-accent btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <HiOutlineBookOpen style={{ fontSize: '1.4rem' }} /> {t('programs.apply')}
            </Link>
            <Link to="/contact" className="btn btn-lg" style={{
              background: 'rgba(255,255,255,0.1)',
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              display: 'inline-flex', alignItems: 'center', gap: 10
            }}>
              <HiOutlineEnvelope style={{ fontSize: '1.4rem' }} /> {t('contact.title')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
