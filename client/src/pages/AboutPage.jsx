import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/translations';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../services/api';
import { 
  HiOutlineHome, 
  HiOutlineChevronRight, 
  HiOutlineTrophy, 
  HiOutlineDocumentText, 
  HiOutlineUserGroup, 
  HiOutlineAcademicCap, 
  HiOutlineBeaker, 
  HiOutlineGlobeAlt,
  HiOutlineBuildingLibrary,
  HiOutlineGlobeEuropeAfrica,
  HiOutlineRocketLaunch,
  HiOutlinePresentationChartBar,
  HiOutlineCheck,
  HiOutlineBanknotes,
  HiOutlineLink,
  HiOutlineCommandLine,
  HiOutlineCpuChip,
  HiOutlineShieldCheck,
  HiOutlineChartBar,
  HiOutlineInformationCircle,
  HiOutlineBriefcase,
  HiOutlineScale,
  HiOutlineUser
} from 'react-icons/hi2';
import { FaHandshake, FaMicrosoft, FaGoogle, FaApple, FaLinux, FaNetworkWired } from 'react-icons/fa6';

const PageHero = ({ title, subtitle }) => (
  <section className="page-hero">
    <div className="container">
      <div className="page-hero-content">
        <div className="breadcrumb">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <HiOutlineHome style={{ fontSize: '1rem' }} /> {useTranslation(useApp().lang).t('nav.home')}
          </Link>
          <span className="breadcrumb-sep"><HiOutlineChevronRight /></span>
          <span>{title}</span>
        </div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  </section>
);

export default function AboutPage() {
  const { lang } = useApp();
  const { t } = useTranslation(lang);

  const achievements = t('about.achievements_items').map((item, i) => ({
    ...item,
    icon: [
      <HiOutlineTrophy />, 
      <HiOutlineDocumentText />, 
      <FaHandshake />, 
      <HiOutlineAcademicCap />, 
      <HiOutlineBeaker />, 
      <HiOutlineGlobeAlt />
    ][i]
  }));

  const partners = t('about.partners_items').map((item, i) => ({
    ...item,
    logo: [
      <FaMicrosoft style={{ color: '#00a4ef' }} />,
      <FaGoogle style={{ color: '#4285f4' }} />,
      <FaNetworkWired style={{ color: '#1ba0d7' }} />,
      <HiOutlineCommandLine style={{ color: '#059669' }} />,
      <FaApple style={{ color: '#555' }} />,
      <FaLinux style={{ color: '#333' }} />
    ][i]
  }));

  const timeline = t('about.timeline_items');
  const tasks = t('about.tasks_items');
  const scientificHighlights = t('about.scientific_highlights');

  return (
    <>
      <PageHero
        title={t('about.title')}
        subtitle={t('about.subtitle')}
      />

      {/* Strategic Goal & Accreditation */}
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: 'var(--space-8)' }}>
            <div style={{
              padding: 'var(--space-10)',
              background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(37,99,235,0.05))',
              borderRadius: 'var(--radius-2xl)',
              border: '1px solid rgba(37,99,235,0.2)',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: -20, right: -20,
                width: 100, height: 100, borderRadius: '50%',
                background: 'rgba(37,99,235,0.1)'
              }} />
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)', color: 'var(--primary-600)' }}>
                <HiOutlineRocketLaunch style={{ transform: 'rotate(-45deg)' }} />
              </div>
              <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-4)', color: 'var(--primary-600)' }}>
                {t('about.goal_title')}
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 'var(--font-size-base)' }}>
                {t('about.goal_desc')}
              </p>
            </div>
            <div style={{
              padding: 'var(--space-10)',
              background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.05))',
              borderRadius: 'var(--radius-2xl)',
              border: '1px solid rgba(245,158,11,0.2)',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: -20, right: -20,
                width: 100, height: 100, borderRadius: '50%',
                background: 'rgba(245,158,11,0.1)'
              }} />
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)', color: 'var(--accent-500)' }}>
                <HiOutlineGlobeEuropeAfrica />
              </div>
              <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-4)', color: 'var(--accent-600)' }}>
                {t('about.accreditation_title')}
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: 'var(--font-size-base)' }}>
                {t('about.accreditation_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tasks */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <HiOutlinePresentationChartBar style={{ fontSize: '1.1rem' }} /> {t('about.tasks_badge')}
            </div>
            <h2 className="section-title">{t('about.tasks_title')}</h2>
          </div>
          
          <div className="grid-3" style={{ gap: 'var(--space-6)' }}>
            {tasks.map((task, i) => (
                <p key={i} style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
                  {task}
                </p>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <HiOutlineBuildingLibrary style={{ fontSize: '1.1rem' }} /> {t('about.leadership_badge')}
            </div>
            <h2 className="section-title">{t('about.leadership_title')}</h2>
          </div>

          <div className="grid-2" style={{ gap: 'var(--space-8)', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Rector */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '300px', overflow: 'hidden' }}>
                <img 
                  src={getImageUrl('/uploads/rector.jpg')} 
                  alt="Rector" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800'; }}
                />
              </div>
              <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Ergashev Oybek Karimovich</h3>
                <p style={{ color: 'var(--primary-600)', fontWeight: 700, fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-2)' }}>
                  {t('staff.rector')}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)' }}>
                  {lang === 'uz' ? 'Kimyo fanlari doktori, professor' : lang === 'en' ? 'Doctor of Chemical Sciences, Professor' : 'Доктор химических наук, профессор'}
                </p>
              </div>
            </div>

            {/* HOD */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '300px', overflow: 'hidden' }}>
                <img 
                  src={getImageUrl('/uploads/mudir.jpg')} 
                  alt="HOD" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800'; }}
                />
              </div>
              <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Erkaboyev Ulug'bek</h3>
                <p style={{ color: 'var(--primary-600)', fontWeight: 700, fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-2)' }}>
                  {t('staff.hod')}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-xs)' }}>
                  {lang === 'uz' ? 'Texnika fanlari doktori (DSc)' : lang === 'en' ? 'Doctor of Sciences (DSc)' : 'Доктор технических наук (DSc)'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scientific Activity */}
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'center', gap: 'var(--space-12)' }}>
            <div>
              <div className="section-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <HiOutlineBeaker style={{ fontSize: '1.1rem' }} /> {t('about.scientific_badge')}
              </div>
              <h2 className="section-title" style={{ textAlign: 'left' }}>{t('about.scientific_title')}</h2>
              <div className="card" style={{ padding: 'var(--space-8)', background: 'linear-gradient(135deg, var(--bg-card), var(--bg-secondary))', marginBottom: 'var(--space-6)' }}>
                <h3 style={{ color: 'var(--primary-600)', marginBottom: 'var(--space-4)', fontSize: '1.2rem' }}>
                  {t('about.scientific_project_title')}
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
                  {t('about.scientific_project_desc')}
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                  <div style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--primary-50)', borderRadius: 'var(--radius-md)', color: 'var(--primary-700)', fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>
                    {t('about.scientific_topic_label')}
                  </div>
                  <div style={{ padding: 'var(--space-2) var(--space-4)', background: 'var(--accent-50)', borderRadius: 'var(--radius-md)', color: 'var(--accent-600)', fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>
                    Scopus / WoS
                  </div>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                {t('about.scientific_extra')}
              </p>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
              <div style={{ padding: 'var(--space-10)', background: 'var(--primary-600)', color: 'white' }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'center' }}>
                  <HiOutlineChartBar />
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 'var(--space-2)' }}>2.4B+</h3>
                <p style={{ opacity: 0.9 }}>{t('about.project_value_label')}</p>
              </div>
              <div style={{ padding: 'var(--space-8)' }}>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {scientificHighlights.map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                      <HiOutlineCheck style={{ color: 'var(--success)' }} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* International Cooperation (Detailed) */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: 'var(--space-12)' }}>
            <div className="card" style={{ padding: 'var(--space-10)', borderLeft: '6px solid var(--accent-500)' }}>
              <div className="section-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <HiOutlineGlobeAlt style={{ fontSize: '1.1rem' }} /> {t('about.cooperation_badge')}
              </div>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: 'var(--space-6)' }}>
                {t('about.cooperation_title')}
              </h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.1rem', marginBottom: 'var(--space-6)' }}>
                {t('about.cooperation_desc')}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }}>
                <div style={{ padding: 'var(--space-4)', background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 800, color: 'var(--primary-600)', marginBottom: 5 }}>Erasmus+</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{lang === 'uz' ? 'Akademik almashinuv' : lang === 'en' ? 'Academic exchange' : 'Академический обмен'}</div>
                </div>
                <div style={{ padding: 'var(--space-4)', background: 'var(--bg-primary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 800, color: 'var(--accent-600)', marginBottom: 5 }}>Konsorsiumlar</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{lang === 'uz' ? 'Xalqaro grantlar' : lang === 'en' ? 'International grants' : 'Международные гранты'}</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-6)' }}>
                {t('about.cooperation_extra')}
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
                <div>
                  <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 900, color: 'var(--primary-600)' }}>15+</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('about.global_partners_label')}</div>
                </div>
                <div style={{ width: 1, background: 'var(--border-color)' }} />
                <div>
                  <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 900, color: 'var(--accent-500)' }}>8</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('about.joint_projects_label')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <HiOutlineInformationCircle style={{ fontSize: '1.1rem' }} /> {t('about.history')}
            </div>
            <h2 className="section-title">{t('about.history')}</h2>
          </div>
          <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
            <div style={{
              position: 'absolute', left: '50%', top: 0, bottom: 0,
              width: 2, background: 'linear-gradient(to bottom, var(--primary-600), var(--accent-500))',
              transform: 'translateX(-50%)'
            }} />
            {timeline.map((item, i) => (
              <div key={item.year} style={{
                display: 'flex', alignItems: 'center',
                gap: 'var(--space-6)',
                marginBottom: 'var(--space-8)',
                flexDirection: i % 2 === 0 ? 'row' : 'row-reverse'
              }}>
                <div style={{ flex: 1, textAlign: i % 2 === 0 ? 'right' : 'left' }}>
                  <div className="card" style={{ padding: 'var(--space-5)', display: 'inline-block', textAlign: 'left' }}>
                    <div style={{
                      fontSize: 'var(--font-size-sm)', fontWeight: 700,
                      color: 'var(--primary-600)', marginBottom: 'var(--space-2)'
                    }}>{item.year}</div>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary-600), var(--accent-500))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 900, fontSize: 'var(--font-size-sm)',
                  zIndex: 1, flexShrink: 0, boxShadow: 'var(--shadow-glow)'
                }}>{i + 1}</div>
                <div style={{ flex: 1 }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <HiOutlineTrophy style={{ fontSize: '1.1rem' }} /> {t('about.achievements')}
            </div>
            <h2 className="section-title">{t('about.achievements')}</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-5)' }}>
            {achievements.map(({ icon, num, label }, i) => (
              <div key={i} className="card" style={{
                padding: 'var(--space-8)',
                textAlign: 'center', transition: 'all 0.25s'
              }}
                onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.03)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-3)' }}>{icon}</div>
                <div style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 900, color: 'var(--primary-600)', marginBottom: 'var(--space-2)' }}>{num}</div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <FaHandshake style={{ fontSize: '1.1rem' }} /> {t('about.partners')}
            </div>
            <h2 className="section-title">{t('about.partners')}</h2>
          </div>
          <div className="grid-3" style={{ gap: 'var(--space-6)' }}>
            {partners.map(({ name, logo, desc }, i) => (
              <div key={i} className="card" style={{ padding: 'var(--space-6)' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                  marginBottom: 'var(--space-4)'
                }}>
                  <span style={{
                    fontSize: '2rem', width: 52, height: 52,
                    background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid var(--border-color)'
                  }}>{logo}</span>
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>{name}</h3>
                </div>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
