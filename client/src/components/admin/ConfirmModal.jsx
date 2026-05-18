import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center', padding: '2rem' }}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
            <HiOutlineExclamationTriangle />
          </div>
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{title || "Diqqat!"}</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          {message || "Haqiqatdan ham o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi."}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1, padding: '10px 0' }}>Bekor qilish</button>
          <button className="btn btn-primary" onClick={() => { onConfirm(); onClose(); }} style={{ flex: 1, padding: '10px 0', background: '#ef4444', borderColor: '#ef4444', color: 'white' }}>
            O'chirish
          </button>
        </div>
      </div>
    </div>
  );
}
