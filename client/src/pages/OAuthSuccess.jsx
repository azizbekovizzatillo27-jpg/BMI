import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, addToast, lang } = useApp();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userStr = params.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        login(user, token);
        addToast(lang === 'uz' ? 'Xush kelibsiz!' : 'Welcome!', 'success');
        navigate('/');
      } catch (err) {
        console.error('OAuth parsing error:', err);
        addToast('Xatolik yuz berdi', 'error');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [location, login, navigate, addToast, lang]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 20px' }}></div>
        <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>
          {lang === 'uz' ? 'Tizimga kirilmoqda...' : 'Logging in...'}
        </h2>
      </div>
    </div>
  );
}
