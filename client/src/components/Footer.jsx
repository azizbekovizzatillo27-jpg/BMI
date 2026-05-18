import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/translations';
import logo from '../assets/logo.png';
import { 
  HiOutlineMapPin, 
  HiOutlinePhone, 
  HiOutlineEnvelope, 
  HiOutlineClock
} from 'react-icons/hi2';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  const { lang } = useApp();
  const { t } = useTranslation(lang);
  const [logoError, setLogoError] = useState(false);

  const links = [
    { label: t('nav.home'), to: '/' },
    { label: t('nav.about'), to: '/about' },
    { label: t('nav.staff'), to: '/staff' },
    { label: t('nav.programs'), to: '/programs' },
    { label: t('nav.schedule'), to: '/schedule' },
    { label: t('nav.news'), to: '/news' },
  ];

  const links2 = [
    { label: t('nav.research'), to: '/research' },
    { label: t('nav.students'), to: '/students' },
    { label: t('nav.gallery'), to: '/gallery' },
    { label: t('nav.contact'), to: '/contact' },
    { label: t('footer.staff_login'), to: '/admin-login' },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-10)' }}>
          {/* Brand Column */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{
              width: 64, height: 64,
              borderRadius: 'var(--radius-xl)', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              marginBottom: 'var(--space-4)',
              overflow: 'hidden',
              background: logoError ? 'linear-gradient(135deg, #1e40af, #3b82f6)' : 'none',
              fontSize: '1rem',
              fontWeight: 900,
              color: 'white'
            }}>
              {!logoError ? (
                <img 
                  src={logo} 
                  alt="NamDTU Logo" 
                  onError={() => setLogoError(true)}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                />
              ) : 'ATT'}
            </div>
            <h3 style={{ color: 'white', fontSize: 'var(--font-size-xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
              NamDTU
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-2)' }}>
              {t('footer.university_full')}
            </p>
            <p className="footer-desc" style={{ marginTop: 'var(--space-3)' }}>
              {t('footer.description')}
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
              {[
                { icon: <FaFacebookF />, color: '#1877F2' },
                { icon: <FaInstagram />, color: '#E4405F' },
                { icon: <FaLinkedinIn />, color: '#0077B5' },
                { icon: <FaYoutube />, color: '#FF0000' }
              ].map((item, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36, background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', transition: 'all 0.3s'
                }}
                  onMouseOver={e => {
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.background = item.color;
                    e.currentTarget.style.borderColor = item.color;
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  }}
                >{item.icon}</a>
              ))}
            </div>
          </div>

          {/* Links 1 */}
          <div className="footer-col">
            <h4>{t('footer.pages')}</h4>
            <ul className="footer-links">
              {links.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to}>
                    <span>›</span> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links 2 */}
          <div className="footer-col">
            <h4>{t('footer.sections')}</h4>
            <ul className="footer-links">
              {links2.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to}>
                    <span>›</span> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>{t('footer.contact')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { icon: <HiOutlineMapPin />, text: t('contact.address_text') },
                { icon: <HiOutlinePhone />, text: t('contact.phone_text') },
                { icon: <HiOutlineEnvelope />, text: t('contact.email_text') },
                { icon: <HiOutlineClock />, text: t('contact.hours_text') },
              ].map(({ icon, text }, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)',
                  color: 'rgba(255,255,255,0.5)', fontSize: 'var(--font-size-sm)'
                }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} NamDTU {lang === 'uz' ? 'ATT Kafedra' : lang === 'ru' ? 'Кафедра ИСТ' : 'IST Department'}. {t('footer.rights')}</p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <a href="#" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 'var(--font-size-xs)' }}>
              {t('footer.privacy')}
            </a>
            <a href="#" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 'var(--font-size-xs)' }}>
              {t('footer.terms')}
            </a>
            <a href="https://namdtu.uz" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--primary-400)', fontSize: 'var(--font-size-xs)' }}>
              namdtu.uz
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
