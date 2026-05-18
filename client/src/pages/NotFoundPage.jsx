import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/translations';
import { HiOutlineHome } from 'react-icons/hi2';

export default function NotFoundPage() {
  const { lang } = useApp();
  const { t } = useTranslation(lang);

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 'var(--space-10)'
    }}>
      <div style={{
        fontSize: '12rem',
        fontWeight: 900,
        lineHeight: 1,
        background: 'linear-gradient(135deg, var(--primary-600), var(--accent-500))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: 'var(--space-6)',
        letterSpacing: '-0.05em'
      }}>
        404
      </div>
      <h1 style={{ fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--space-4)' }}>
        {t('common.not_found')}
      </h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', marginBottom: 'var(--space-10)', fontSize: 'var(--font-size-lg)' }}>
        {t('common.not_found_desc')}
      </p>
      <Link to="/" className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <HiOutlineHome /> {t('common.back_home')}
      </Link>
    </div>
  );
}
