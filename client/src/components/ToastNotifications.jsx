import { useApp } from '../context/AppContext';

export default function ToastNotifications() {
  const { toasts, removeToast } = useApp();

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  };

  return (
    <div className="toast-container">
      {toasts.map(({ id, message, type }) => (
        <div key={id} className={`toast toast-${type}`}>
          <span style={{ fontSize: '1.2rem' }}>{icons[type] || icons.info}</span>
          <span style={{ flex: 1, fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>{message}</span>
          <button
            onClick={() => removeToast(id)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1rem' }}
          >✕</button>
        </div>
      ))}
    </div>
  );
}
