import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/translations';
import { staffAPI, getImageUrl } from '../services/api';
import { 
  HiOutlineHome, 
  HiOutlineChevronRight, 
  HiOutlineEnvelope, 
  HiOutlinePhone,
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineBriefcase,
  HiOutlineBeaker,
  HiOutlineLink,
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlinePaperAirplane,
  HiOutlineIdentification,
  HiOutlineArrowLeft
} from 'react-icons/hi2';
import { FaLinkedin } from 'react-icons/fa6';

export default function StaffDetailPage() {
  const { id } = useParams();
  const { lang } = useApp();
  const { t } = useTranslation(lang);
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    staffAPI.getById(id).then(res => {
      setPerson(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-state" style={{ minHeight: '100vh' }}><div className="spinner" /></div>;
  if (!person) return <div style={{ padding: 80, textAlign: 'center' }}>{t('staff.not_found')}</div>;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <HiOutlineHome style={{ fontSize: '1rem' }} /> {t('nav.home')}
            </Link>
            <span className="breadcrumb-sep"><HiOutlineChevronRight /></span>
            <Link to="/staff">{t('staff.title')}</Link>
            <span className="breadcrumb-sep"><HiOutlineChevronRight /></span>
            <span>{person[`name_${lang}`]}</span>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: 'var(--space-10)', alignItems: 'start' }}>
            {/* Profile Card */}
            <div style={{ position: 'sticky', top: '100px' }}>
              <div className="card" style={{ padding: 'var(--space-10)', textAlign: 'center' }}>
                {person.photo ? (
                  <img
                    src={getImageUrl(person.photo)}
                    alt={person[`name_${lang}`]}
                    style={{
                      width: 180, height: 180, borderRadius: '50%', objectFit: 'cover',
                      border: '4px solid white', margin: '0 auto var(--space-6)',
                      display: 'block', boxShadow: 'var(--shadow-md)'
                    }}
                  />
                ) : (
                  <div style={{
                    width: 180, height: 180, borderRadius: '50%',
                    background: 'var(--primary-50)', color: 'var(--primary-600)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '4.5rem', fontWeight: 900, margin: '0 auto var(--space-6)',
                    boxShadow: 'var(--shadow-md)', textTransform: 'uppercase',
                    border: '4px solid white'
                  }}>
                    {person[`name_${lang}`]?.charAt(0)}
                  </div>
                )}
                <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
                  {person[`name_${lang}`]}
                </h1>
                <p style={{ color: 'var(--primary-600)', fontWeight: 600, fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-2)' }}>
                  {person[`position_${lang}`]}
                </p>
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 'var(--space-6)' }}>
                  {person[`degree_${lang}`]}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                  <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--primary-600)' }}>{person.articles}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>{t('staff.articles')}</div>
                  </div>
                  <div style={{ background: 'var(--bg-primary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--accent-600)' }}>{person.experience}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>{t('staff.experience')}</div>
                  </div>
                </div>

                {/* Contact */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  <a href={`mailto:${person.email}`} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <HiOutlineEnvelope style={{ fontSize: '1.2rem' }} /> {person.email}
                  </a>
                  {person.phone && (
                    <a href={`tel:${person.phone}`} className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                      <HiOutlinePhone style={{ fontSize: '1.2rem' }} /> {person.phone}
                    </a>
                  )}
                </div>

                {/* Social */}
                {person.social && (
                  <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginTop: 'var(--space-5)' }}>
                    {person.social.linkedin && <a href={person.social.linkedin} className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FaLinkedin style={{ color: '#0077b5' }} /> LinkedIn</a>}
                    {person.social.google_scholar && <a href={person.social.google_scholar} className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><HiOutlineAcademicCap style={{ color: '#4285f4' }} /> Scholar</a>}
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
               {/* Bio */}
              <div className="card" style={{ padding: 'var(--space-8)' }}>
                <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <HiOutlineIdentification style={{ color: 'var(--primary-600)' }} /> {t('staff.bio')}
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  {person[`bio_${lang}`]}
                </p>
              </div>

              {/* Career Timeline */}
              {person[`career_${lang}`] && (
                <div className="card" style={{ padding: 'var(--space-8)' }}>
                <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <HiOutlineBriefcase style={{ color: 'var(--primary-600)' }} /> {t('staff.career')}
                </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {person[`career_${lang}`].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: 'var(--space-4)', position: 'relative' }}>
                        <div style={{
                          minWidth: '100px', fontWeight: 700, color: 'var(--primary-600)',
                          fontSize: '0.85rem', paddingTop: '4px'
                        }}>
                          {item.years}
                        </div>
                        <div style={{
                          width: '2px', background: 'var(--border-color)', 
                          position: 'relative', margin: '0 4px'
                        }}>
                          <div style={{
                            position: 'absolute', top: 8, left: -4, width: 10, height: 10,
                            borderRadius: '50%', background: 'var(--primary-600)',
                            border: '2px solid white'
                          }} />
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', flex: 1 }}>
                          {item.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Publications / DOIs */}
              {person.publications && (
                <div className="card" style={{ padding: 'var(--space-8)', background: 'var(--bg-secondary)' }}>
                  <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <HiOutlineBeaker style={{ color: 'var(--primary-600)' }} /> {t('staff.scientific_works')}
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {person.publications.map((url, i) => (
                      <a 
                        key={i} href={url} target="_blank" rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm"
                        style={{ justifyContent: 'start', textAlign: 'left', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', gap: 10 }}
                      >
                        <HiOutlineLink style={{ fontSize: '1rem', color: 'var(--primary-600)' }} /> {url.split('doi.org/')[1] || url}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Subjects */}
              <div className="card" style={{ padding: 'var(--space-8)' }}>
                <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <HiOutlineBookOpen style={{ color: 'var(--primary-600)' }} /> {t('staff.subjects')}
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  {(person[`subjects_${lang}`] || []).map((sub, i) => (
                    <span key={i} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                      padding: 'var(--space-2) var(--space-4)',
                      background: 'var(--primary-50)',
                      border: '1px solid var(--primary-100)',
                      borderRadius: 'var(--radius-lg)',
                      fontSize: 'var(--font-size-sm)', fontWeight: 600,
                      color: 'var(--primary-700)'
                    }}>
                      <HiOutlineBookOpen style={{ color: 'var(--primary-600)', fontSize: '0.9rem' }} /> {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Research info */}
              <div className="card" style={{
                padding: 'var(--space-8)',
                background: 'linear-gradient(135deg, rgba(245,158,11,0.05), rgba(245,158,11,0.02))',
                border: '1px solid rgba(245,158,11,0.1)'
              }}>
                <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: 'var(--space-5)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <HiOutlineBeaker style={{ color: 'var(--accent-500)' }} /> {t('staff.scientific_activity')}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontWeight: 800, fontSize: 'var(--font-size-2xl)', color: 'var(--primary-600)' }}>{person.articles}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {t('staff.total_articles')}
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontWeight: 800, fontSize: 'var(--font-size-2xl)', color: 'var(--accent-600)' }}>{person.experience}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                      {t('staff.years_active')}
                    </div>
                  </div>
                </div>
              </div>

              <Link to="/staff" className="btn btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <HiOutlineArrowLeft /> {t('common.back')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
