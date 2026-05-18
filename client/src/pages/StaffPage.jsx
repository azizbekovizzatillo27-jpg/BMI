import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/translations';
import { staffAPI } from '../services/api';
import { 
  HiOutlineHome, 
  HiOutlineChevronRight, 
  HiOutlineMagnifyingGlass, 
  HiOutlineXMark,
  HiOutlineAcademicCap,
  HiOutlineEnvelope,
  HiOutlineDocumentText,
  HiOutlineBriefcase,
  HiOutlineArrowRight,
  HiOutlineBuildingOffice2,
  HiOutlineUsers,
  HiOutlinePhone
} from 'react-icons/hi2';

export default function StaffPage() {
  const { lang } = useApp();
  const { t } = useTranslation(lang);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    staffAPI.getAll().then(res => {
      setStaff(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = staff.filter(s =>
    s[`name_${lang}`]?.toLowerCase().includes(search.toLowerCase()) ||
    s[`position_${lang}`]?.toLowerCase().includes(search.toLowerCase())
  );

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
              <span>{t('staff.title')}</span>
            </div>
            <h1>{t('staff.title')}</h1>
            <p className="hero-subtitle" style={{ marginTop: '1rem' }}>{t('staff.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div className="mb-12">
            <div className="search-box mx-auto lg:mx-0 flex items-center gap-2" style={{ maxWidth: '600px', padding: '12px 24px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
              <HiOutlineMagnifyingGlass style={{ fontSize: '1.4rem', color: 'var(--primary-600)' }} />
              <input
                type="text"
                placeholder={t('common.search')}
                style={{ background: 'none', border: 'none', padding: '10px', fontSize: '1rem', width: '100%', outline: 'none', color: 'var(--text-primary)' }}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <HiOutlineXMark />
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="loading-state"><div className="spinner" /><p>{t('common.loading')}</p></div>
          ) : (
            <>
              {/* Leadership Section */}
              {!search && (
                <div className="leader-section animate-fadeInUp" style={{ marginBottom: 'var(--space-16)' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-8)' }}>
                    {/* Rector */}
                    {(() => {
                      const rector = staff.find(s => s.position_uz?.toLowerCase().includes('rektor'));
                      if (!rector) return null;
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 500px', maxWidth: '700px', width: '100%' }}>
                          <h2 className="leader-title" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-6)' }}>
                            <HiOutlineBuildingOffice2 style={{ color: 'var(--accent-500)' }} /> {t('staff.uni_leadership')}
                          </h2>
                          <div className="card" style={{ 
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            padding: '2rem', textAlign: 'center',
                            background: 'linear-gradient(135deg, rgba(37,99,235,0.05), rgba(37,99,235,0.02))',
                            borderRadius: 'var(--radius-2xl)',
                            border: '1px solid rgba(37,99,235,0.1)',
                            position: 'relative', overflow: 'hidden',
                            flex: 1
                          }}>
                            <div style={{
                              position: 'absolute', top: -20, right: -20,
                              width: 200, height: 200, borderRadius: '50%',
                              background: 'rgba(37,99,235,0.05)'
                            }} />
                            <div className="relative mb-6" style={{ position: 'relative', flexShrink: 0, margin: '0 auto' }}>
                              <div className="badge badge-gold" style={{ position: 'absolute', top: '-12px', right: '-12px', zIndex: 2 }}>{t('staff.rector')}</div>
                              <img 
                                src={rector.photo} 
                                alt={rector[`name_${lang}`]} 
                                style={{ width: '200px', height: '200px', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: 'var(--shadow-md)' }}
                                onError={e => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(rector[`name_${lang}`])}&background=2563eb&color=fff&size=400`}
                              />
                            </div>
                            <div className="leader-info" style={{ width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
                              <h2 className="leader-name" style={{ fontSize: '1.8rem', fontWeight: 800 }}>{rector[`name_${lang}`]}</h2>
                              <div className="leader-position" style={{ color: 'var(--accent-600)', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{rector[`position_${lang}`]}</div>
                              <p className="leader-bio" style={{ marginBottom: 'var(--space-6)', fontSize: '1rem', lineHeight: '1.7' }}>
                                {rector[`bio_${lang}`]}
                              </p>
                              
                              <div className="leader-meta-grid" style={{ textAlign: 'left', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div className="leader-meta-item" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.2rem' }}>
                                  <span className="leader-meta-label" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}><HiOutlineEnvelope style={{ marginRight: 8, verticalAlign: 'middle' }} /> {t('staff.email')}</span>
                                  <span className="leader-meta-value" style={{ fontSize: '0.9rem', fontWeight: 500 }}>{rector.email}</span>
                                </div>
                                <div className="leader-meta-item" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.2rem' }}>
                                  <span className="leader-meta-label" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}><HiOutlinePhone style={{ marginRight: 8, verticalAlign: 'middle' }} /> {t('common.phone')}</span>
                                  <span className="leader-meta-value" style={{ fontSize: '0.9rem', fontWeight: 500 }}>{rector.phone}</span>
                                </div>
                                <div className="leader-meta-item" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.2rem' }}>
                                  <span className="leader-meta-label" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}><HiOutlineAcademicCap style={{ marginRight: 8, verticalAlign: 'middle' }} /> {t('staff.degree')}</span>
                                  <span className="leader-meta-value" style={{ fontSize: '0.9rem', fontWeight: 500 }}>{rector[`degree_${lang}`]}</span>
                                </div>
                              </div>

                              <div style={{ marginTop: 'var(--space-8)' }}>
                                <Link to={`/staff/${rector.id}`} className="btn btn-accent" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%' }}>
                                  {t('staff.view_profile')} <HiOutlineArrowRight />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* HOD */}
                    {(() => {
                      const leader = staff.find(s => s.position_uz?.toLowerCase().includes('mudir'));
                      if (!leader) return null;
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 500px', maxWidth: '800px', width: '100%' }}>
                          <h2 className="leader-title" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-6)' }}>
                            <HiOutlineAcademicCap style={{ color: 'var(--primary-600)' }} /> {t('staff.dept_leadership')}
                          </h2>
                          <div className="card" style={{ 
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            padding: '2rem', textAlign: 'center',
                            background: 'linear-gradient(135deg, rgba(245,158,11,0.05), rgba(245,158,11,0.02))',
                            borderRadius: 'var(--radius-2xl)',
                            border: '1px solid rgba(245,158,11,0.1)',
                            position: 'relative', overflow: 'hidden',
                            flex: 1
                          }}>
                            <div style={{
                              position: 'absolute', top: -20, right: -20,
                              width: 200, height: 200, borderRadius: '50%',
                              background: 'rgba(245,158,11,0.05)'
                            }} />
                            <div className="relative mb-6" style={{ position: 'relative', flexShrink: 0, margin: '0 auto' }}>
                              <div className="badge badge-blue" style={{ position: 'absolute', top: '-12px', right: '-12px', zIndex: 2 }}>{t('staff.hod')}</div>
                              <img 
                                src={leader.photo} 
                                alt={leader[`name_${lang}`]} 
                                style={{ width: '200px', height: '200px', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: 'var(--shadow-md)' }}
                                onError={e => e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(leader[`name_${lang}`])}&background=2563eb&color=fff&size=400`}
                              />
                            </div>
                            <div className="leader-info" style={{ width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}>
                              <h2 className="leader-name" style={{ fontSize: '1.8rem', fontWeight: 800 }}>{leader[`name_${lang}`]}</h2>
                              <div className="leader-position" style={{ color: 'var(--primary-600)', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{leader[`position_${lang}`]}</div>
                              <p className="leader-bio" style={{ marginBottom: 'var(--space-6)', fontSize: '1rem', lineHeight: '1.7' }}>
                                {leader[`bio_${lang}`] || t('staff.subtitle')}
                              </p>
                              
                              <div className="leader-meta-grid" style={{ textAlign: 'left', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div className="leader-meta-item" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.2rem' }}>
                                  <span className="leader-meta-label" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}><HiOutlineEnvelope style={{ marginRight: 8, verticalAlign: 'middle' }} /> {t('staff.email')}</span>
                                  <span className="leader-meta-value" style={{ fontSize: '0.9rem', fontWeight: 500 }}>{leader.email}</span>
                                </div>
                                <div className="leader-meta-item" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.2rem' }}>
                                  <span className="leader-meta-label" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}><HiOutlineDocumentText style={{ marginRight: 8, verticalAlign: 'middle' }} /> {t('staff.articles')}</span>
                                  <span className="leader-meta-value" style={{ fontSize: '0.9rem', fontWeight: 500 }}>{leader.articles}+</span>
                                </div>
                                <div className="leader-meta-item" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.2rem' }}>
                                  <span className="leader-meta-label" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}><HiOutlineBriefcase style={{ marginRight: 8, verticalAlign: 'middle' }} /> {t('staff.experience')}</span>
                                  <span className="leader-meta-value" style={{ fontSize: '0.9rem', fontWeight: 500 }}>{leader.experience} {t('staff.years')}</span>
                                </div>
                              </div>

                              <div style={{ marginTop: 'var(--space-8)' }}>
                                <Link to={`/staff/${leader.id}`} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%' }}>
                                  {t('staff.view_profile')} <HiOutlineArrowRight />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* General Staff Grid */}
              <div className="grid-auto">
                {filtered
                  .filter(s => !s.position_uz?.toLowerCase().includes('mudir') && !s.position_uz?.toLowerCase().includes('rektor'))
                  .map(person => (
                    <div key={person.id} className="card p-6 flex flex-col items-center text-center" style={{ borderRadius: 'var(--radius-2xl)', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
                      <div className="relative mb-6">
                        {person.photo ? (
                          <img
                            src={person.photo}
                            alt={person[`name_${lang}`]}
                            className="w-24 h-24 rounded-full object-cover shadow-sm border-2 border-primary-100"
                            style={{ width: '96px', height: '96px' }}
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center text-3xl font-bold shadow-sm border-2 border-primary-100" style={{ width: '96px', height: '96px' }}>
                            {person[`name_${lang}`]?.charAt(0)}
                          </div>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-primary-900 mb-1" style={{ fontSize: '1.1rem' }}>{person[`name_${lang}`]}</h3>
                      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4" style={{ fontSize: '0.8rem' }}>{person[`position_${lang}`]}</p>
                      
                      <div className="flex justify-center mb-6" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                        {(person[`subjects_${lang}`] || []).slice(0, 2).map((sub, i) => (
                          <span key={i} className="px-2 py-1 bg-primary-50 text-primary-700 rounded-md border border-primary-100" style={{ fontSize: '0.7rem', fontWeight: 600 }}>{sub}</span>
                        ))}
                      </div>

                      <div className="grid-2 w-full pt-4 mb-6" style={{ borderTop: '1px solid var(--border-color)', gap: '1rem' }}>
                        <div>
                           <p className="font-bold text-primary-700" style={{ fontSize: '1.2rem', marginBottom: 0 }}>{person.articles}</p>
                           <p className="font-semibold uppercase" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('staff.articles')}</p>
                        </div>
                        <div style={{ borderLeft: '1px solid var(--border-color)' }}>
                           <p className="font-bold text-primary-700" style={{ fontSize: '1.2rem', marginBottom: 0 }}>{person.experience}</p>
                           <p className="font-semibold uppercase" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('staff.experience')}</p>
                        </div>
                      </div>

                      <Link to={`/staff/${person.id}`} className="btn btn-secondary w-full mt-auto py-2" style={{ fontSize: '0.9rem' }}>
                        {t('staff.view_profile')}
                      </Link>
                    </div>
                ))}
              </div>
            </>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)', opacity: 0.3 }}>
                <HiOutlineMagnifyingGlass />
              </div>
              <p>{t('staff.search_empty')}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
