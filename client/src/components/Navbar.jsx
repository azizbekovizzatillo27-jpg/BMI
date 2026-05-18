import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/translations';
import logo from '../assets/logo.png';
import { 
  HiOutlineHome, 
  HiOutlineInformationCircle, 
  HiOutlineUsers, 
  HiOutlineAcademicCap, 
  HiOutlineCalendar, 
  HiOutlineNewspaper, 
  HiOutlineBeaker, 
  HiOutlineUserGroup, 
  HiOutlinePhoto, 
  HiOutlineEnvelope, 
  HiOutlineLockClosed, 
  HiOutlineCog6Tooth,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineUser,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineChevronDown,
  HiOutlineBars3,
  HiOutlineXMark
} from 'react-icons/hi2';

const NavIcon = ({ path }) => {
  const iconStyle = { fontSize: '1.2em', verticalAlign: 'middle' };
  const icons = {
    '/': <HiOutlineHome style={iconStyle} />, 
    '/about': <HiOutlineInformationCircle style={iconStyle} />, 
    '/staff': <HiOutlineUsers style={iconStyle} />, 
    '/programs': <HiOutlineAcademicCap style={iconStyle} />,
    '/schedule': <HiOutlineCalendar style={iconStyle} />, 
    '/news': <HiOutlineNewspaper style={iconStyle} />, 
    '/research': <HiOutlineBeaker style={iconStyle} />,
    '/gallery': <HiOutlinePhoto style={iconStyle} />, 
    '/contact': <HiOutlineEnvelope style={iconStyle} />,
    '/admin': <HiOutlineCog6Tooth style={iconStyle} />
  };
  return <span style={{display: 'inline-flex', alignItems: 'center'}}>{icons[path] || '•'}</span>;
};

export default function Navbar() {
  const { theme, toggleTheme, lang, toggleLang, changeLang, user, logout } = useApp();
  const { t } = useTranslation(lang);
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/staff', label: t('nav.staff') },
    { path: '/programs', label: t('nav.programs') },
    { path: '/schedule', label: t('nav.schedule') },
    { path: '/news', label: t('nav.news') },
    { path: '/research', label: t('nav.research') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const isHeroPage = ['/'].includes(location.pathname);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="flex items-center justify-between">
            {/* Brand */}
            <Link to="/" className="navbar-brand">
              <div className="navbar-logo" style={{ 
                overflow: 'hidden', 
                padding: 0, 
                background: logoError ? 'linear-gradient(135deg, #1e40af, #3b82f6)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 900,
                color: 'white'
              }}>
                {!logoError ? (
                  <img 
                    src={logo} 
                    alt="Logo" 
                    onError={() => setLogoError(true)}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                ) : 'ATT'}
              </div>
              <div>
                <div className="navbar-name" style={{
                  color: scrolled ? 'var(--text-primary)' : 'white'
                }}>
                  NamDTU
                </div>
                <div className="navbar-sub" style={{
                  color: scrolled ? 'var(--text-muted)' : 'rgba(255,255,255,0.7)'
                }}>{lang === 'uz' ? 'ATT Kafedra' : lang === 'ru' ? 'Кафедра ИСТ' : 'IST Department'}</div>
              </div>
            </Link>

            {/* Desktop Links */}
            <ul className="navbar-links">
              {navLinks.map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className={`navbar-link ${location.pathname === path ? 'active' : ''}`}
                    style={{
                      color: !scrolled
                        ? location.pathname === path ? '#60a5fa' : 'rgba(255,255,255,0.9)'
                        : undefined
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Lang Toggle */}
              <div className="lang-toggle-wrapper">
                <div 
                  className="lang-indicator" 
                  style={{ 
                    transform: `translateX(${lang === 'uz' ? '0' : lang === 'ru' ? '45.3px' : '90.6px'})` 
                  }} 
                />
                <button
                  className={`lang-btn ${lang === 'uz' ? 'active' : ''}`}
                  onClick={() => lang !== 'uz' && changeLang('uz')}
                >UZ</button>
                <button
                  className={`lang-btn ${lang === 'ru' ? 'active' : ''}`}
                  onClick={() => lang !== 'ru' && changeLang('ru')}
                >RU</button>
                <button
                  className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                  onClick={() => lang !== 'en' && changeLang('en')}
                >EN</button>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="theme-toggle-btn"
                title={theme === 'dark' ? t('common.light_mode') : t('common.dark_mode')}
              >
                {theme === 'dark' ? <HiOutlineSun /> : <HiOutlineMoon />}
              </button>

              {user && (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="user-menu-btn"
                  >
                    <HiOutlineUser style={{ fontSize: '1.1rem' }} /> {user.name?.split(' ')[0]}
                    <HiOutlineChevronDown style={{ fontSize: '0.8rem' }} />
                  </button>
                  {userMenuOpen && (
                    <div className="user-dropdown">
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="dropdown-item">
                          <HiOutlineCog6Tooth style={{ fontSize: '1.2rem', color: 'var(--primary-600)' }} /> {t('nav.admin')}
                        </Link>
                      )}
                      <button onClick={handleLogout} className="dropdown-item" style={{ color: '#ef4444', background: 'none', border: 'none', width: '100%', cursor: 'pointer', fontFamily: 'var(--font-sans)', borderTop: '1px solid var(--border-color)', borderRadius: 0 }}>
                        <HiOutlineArrowLeftOnRectangle style={{ fontSize: '1.2rem' }} /> {t('nav.logout')}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Toggle */}
              <button
                className="navbar-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <HiOutlineXMark /> : <HiOutlineBars3 />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
        <div className="mobile-sidebar">
          <div className="flex items-center justify-between mb-6">
            <span style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)', color: 'var(--text-primary)' }}>{t('nav.menu')}</span>
            <button
              onClick={() => setMobileOpen(false)}
              style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-primary)' }}
            ><HiOutlineXMark /></button>
          </div>
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`admin-nav-item ${location.pathname === path ? 'active' : ''}`}
              style={{ color: location.pathname === path ? '#60a5fa' : 'var(--text-secondary)' }}
            >
              <NavIcon path={path} /> {label}
            </Link>
          ))}
          <div style={{ marginTop: 'var(--space-6)', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--space-6)' }}>
            {user && (
              <button onClick={handleLogout} className="btn btn-ghost w-full" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <HiOutlineArrowLeftOnRectangle style={{ fontSize: '1.2rem' }} /> {t('nav.logout')}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
