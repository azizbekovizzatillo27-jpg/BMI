import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/translations';
import { authAPI } from '../services/api';
import { HiOutlineArrowLeft, HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { FaGoogle, FaTelegram } from 'react-icons/fa6';
import logo from '../assets/logo.png';

export default function AdminLoginPage() {
  const { lang, login, addToast } = useApp();
  const { t } = useTranslation(lang);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login(formData);
      if (res.data.user.role !== 'admin') {
        addToast("Faqat adminlar kira oladi!", 'error');
        return;
      }
      login(res.data.user, res.data.token);
      addToast(t('auth.success_login'), 'success');
      navigate('/admin');
    } catch (err) {
      addToast(err.response?.data?.error || t('auth.err_generic'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Decorative Background Elements */}
      <div className="auth-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <img src={logo} alt="Logo" className="w-12 h-12" />
            </Link>
            <h1>Admin Panel</h1>
            <p>Xizmat doirasida foydalanish uchun</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-group">
              <label>{t('auth.email')}</label>
              <div className="input-wrapper">
                <HiOutlineEnvelope className="input-icon" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@namdtu.uz"
                />
              </div>
            </div>

            <div className="auth-input-group">
              <div className="label-row">
                <label>{t('auth.password')}</label>
              </div>
              <div className="input-wrapper">
                <HiOutlineLockClosed className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                />
                <button 
                  type="button" 
                  className="show-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <HiOutlineEyeSlash /> : <HiOutlineEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <div className="loading-spinner" />
              ) : (
                <span>Kirish</span>
              )}
            </button>
          </form>

          {/* Demo Access Info - Glass Style */}
          <div className="demo-info-box">
            <div className="demo-header">
              <span className="pulse-dot"></span>
              <h3>Boshqaruv Tizimi</h3>
            </div>
            <div className="demo-credentials">
              <div className="cred-item">
                <span className="label">Admin:</span>
                <span className="value">admin@namdtu.uz</span>
              </div>
              <div className="cred-item">
                <span className="label">Parol:</span>
                <span className="value">admin123</span>
              </div>
            </div>
          </div>

          <Link to="/" className="auth-back-link">
            <HiOutlineArrowLeft /> Saytga qaytish
          </Link>
        </div>
      </div>
    </div>
  );
}
