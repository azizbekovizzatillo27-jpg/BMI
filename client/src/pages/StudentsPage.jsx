import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/translations';
import { studentsAPI } from '../services/api';
import { 
  HiOutlineHome, 
  HiOutlineChevronRight, 
  HiOutlineBookOpen, 
  HiOutlineAcademicCap, 
  HiOutlineClipboardDocumentList,
  HiOutlineDocumentText,
  HiOutlineFolder,
  HiOutlineUser,
  HiOutlineCube,
  HiOutlineArrowDownTray,
  HiOutlineCheckCircle,
  HiOutlineChevronDoubleRight
} from 'react-icons/hi2';

export default function StudentsPage() {
  const { lang } = useApp();
  const { t } = useTranslation(lang);
  const [activeTab, setActiveTab] = useState('materials');
  const [materials, setMaterials] = useState([]);
  const [theses, setTheses] = useState([]);
  const [requirements, setRequirements] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      studentsAPI.getMaterials(),
      studentsAPI.getTheses(),
      studentsAPI.getRequirements()
    ]).then(([mRes, tRes, rRes]) => {
      setMaterials(mRes.data);
      setTheses(tRes.data);
      setRequirements(rRes.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const tabs = [
    { id: 'materials', label: t('students.materials'), icon: <HiOutlineBookOpen /> },
    { id: 'theses', label: t('students.theses'), icon: <HiOutlineAcademicCap /> },
    { id: 'requirements', label: t('students.requirements'), icon: <HiOutlineClipboardDocumentList /> },
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
              <span>{t('students.title')}</span>
            </div>
            <h1>{t('students.title')}</h1>
            <p>{t('students.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-10)' }}>
            <div className="tab-list">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span style={{ marginRight: '8px', display: 'flex', alignItems: 'center' }}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading-state"><div className="spinner" /></div>
          ) : (
            <div className="animate-fadeInUp">
              {/* Materials Tab */}
              {activeTab === 'materials' && (
                <div className="grid-2">
                  {materials.map(item => (
                    <div key={item.id} className="card" style={{ padding: 'var(--space-6)', display: 'flex', gap: 'var(--space-5)', alignItems: 'center' }}>
                      <div style={{
                        width: '60px', height: '60px', borderRadius: 'var(--radius-lg)',
                        background: 'var(--primary-100)', color: 'var(--primary-600)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
                      }}>
                        {item.type === 'pdf' ? <HiOutlineDocumentText /> : <HiOutlineFolder />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="text-xs font-bold text-primary-color mb-1">{item.subject}</div>
                        <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, marginBottom: '4px' }}>
                          {item[`title_${lang}`]}
                        </h3>
                        <div className="text-xs text-muted" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><HiOutlineUser /> {item.author}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><HiOutlineCube /> {item.size}</span>
                        </div>
                      </div>
                      <a href={item.url} className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <HiOutlineArrowDownTray /> {t('students.download')}
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* Theses Tab */}
              {activeTab === 'theses' && (
                <div className="card" style={{ overflow: 'hidden' }}>
                  <table className="schedule-table">
                    <thead>
                      <tr>
                        <th>{t('students.year')}</th>
                        <th>{t('students.table_student')}</th>
                        <th>{t('students.table_subject')}</th>
                        <th>{t('students.advisor')}</th>
                        <th>{t('students.grade')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {theses.map(item => (
                        <tr key={item.id}>
                          <td><strong>{item.year}</strong></td>
                          <td>{item.student}</td>
                          <td>{item[`title_${lang}`]}</td>
                          <td className="text-primary-color font-semibold">{item.advisor}</td>
                          <td><span className="badge badge-green">{item.grade}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Requirements Tab */}
              {activeTab === 'requirements' && requirements && (
                <div className="grid-2">
                  <div className="card" style={{ padding: 'var(--space-8)' }}>
                    <h3 className="flex items-center gap-3 mb-6" style={{ fontSize: 'var(--font-size-xl)' }}>
                      <HiOutlineBookOpen style={{ color: 'var(--primary-600)' }} /> {t('students.course_work')}
                    </h3>
                    <ul className="flex flex-col gap-4">
                      {requirements.course_work.map((req, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-secondary">
                          <HiOutlineCheckCircle style={{ color: 'var(--success)', marginTop: 2 }} /> {req}
                        </li>
                      ))}
                    </ul>
                    <button className="btn btn-primary btn-sm w-full mt-8" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                      <HiOutlineArrowDownTray /> {t('students.download_regulations')}
                    </button>
                  </div>
                  <div className="card" style={{ padding: 'var(--space-8)' }}>
                    <h3 className="flex items-center gap-3 mb-6" style={{ fontSize: 'var(--font-size-xl)' }}>
                      <HiOutlineAcademicCap style={{ color: 'var(--accent-500)' }} /> {t('students.diploma')}
                    </h3>
                    <ul className="flex flex-col gap-4">
                      {requirements.diploma.map((req, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-secondary">
                          <HiOutlineChevronDoubleRight style={{ color: 'var(--primary-600)', marginTop: 2, fontSize: '0.8rem' }} /> {req}
                        </li>
                      ))}
                    </ul>
                    <button className="btn btn-accent btn-sm w-full mt-8" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                      <HiOutlineArrowDownTray /> {t('students.download_instructions')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
