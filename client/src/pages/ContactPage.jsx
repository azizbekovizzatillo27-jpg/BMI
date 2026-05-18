import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/translations';
import { contactAPI } from '../services/api';
import { 
  HiOutlineHome, 
  HiOutlineChevronRight, 
  HiOutlineMapPin, 
  HiOutlinePhone, 
  HiOutlineEnvelope, 
  HiOutlineClock,
  HiOutlineMap,
  HiOutlinePaperAirplane
} from 'react-icons/hi2';

export default function ContactPage() {
  const { lang, addToast, user } = useApp();
  const { t } = useTranslation(lang);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast(t('contact.err_login'), 'error');
      return;
    }
    setLoading(true);
    try {
      await contactAPI.send(formData);
      addToast(t('contact.success_msg'), 'success');
      setFormData({ name: user?.name || '', email: user?.email || '', subject: '', message: '' });
    } catch (err) {
      addToast(t('contact.err_send'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: <HiOutlineMapPin />, title: t('contact.address'), detail: t('contact.address_text') },
    { icon: <HiOutlinePhone />, title: t('contact.phone'), detail: t('contact.phone_text') },
    { icon: <HiOutlineEnvelope />, title: t('contact.email'), detail: t('contact.email_text') },
    { icon: <HiOutlineClock />, title: t('contact.working_hours'), detail: t('contact.hours_text') },
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
              <span>{t('contact.title')}</span>
            </div>
            <h1>{t('contact.title')}</h1>
            <p>{t('contact.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: 'var(--space-10)' }}>
            {/* Contact Info */}
            <div>
              {contactInfo.map((info, i) => (
                <div key={i} className="contact-info-item">
                  <div className="contact-icon">{info.icon}</div>
                  <div>
                    <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, marginBottom: '4px' }}>{info.title}</h4>
                    <p style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-secondary)' }}>{info.detail}</p>
                  </div>
                </div>
              ))}

              <div className="card" style={{ marginTop: 'var(--space-8)', padding: 'var(--space-6)', overflow: 'hidden' }}>
                <h4 style={{ marginBottom: 'var(--space-4)' }}>{t('contact.our_location')}</h4>
                <div style={{ width: '100%', height: '250px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'var(--space-6)' }}>
                  <div>
                    <div style={{ fontSize: '3rem', color: 'var(--primary-600)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                      <HiOutlineMap />
                    </div>
                    <p className="text-sm text-muted">{t('contact.map_placeholder')}</p>
                    <a href="https://maps.google.com" target="_blank" className="btn btn-ghost btn-sm mt-4">{t('contact.view_map')}</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card" style={{ padding: 'var(--space-10)' }}>
              <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <HiOutlineEnvelope style={{ color: 'var(--primary-600)' }} /> {t('contact.send_message')}
              </h2>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                  <div className="form-group">
                    <label className="form-label">{t('contact.your_name')} *</label>
                    <input
                      className="form-input"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t('contact.placeholder_name')}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t('contact.your_email')} *</label>
                    <input
                      type="email"
                      className="form-input"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder={t('contact.placeholder_email')}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
                  <label className="form-label">{t('contact.subject')}</label>
                  <input
                    className="form-input"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    placeholder={t('contact.placeholder_subject')}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 'var(--space-8)' }}>
                  <label className="form-label">{t('contact.message')} *</label>
                  <textarea
                    className="form-textarea"
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t('contact.placeholder_message')}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
                  {loading ? (
                    <><div className="spinner" style={{ width: '20px', height: '20px', borderTopColor: 'white' }} /> {t('common.loading')}</>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                      <HiOutlinePaperAirplane style={{ transform: 'rotate(-45deg)', marginBottom: 2 }} /> {t('contact.send_btn')}
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
