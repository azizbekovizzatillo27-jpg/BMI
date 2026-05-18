import { useState } from 'react';
import { contactAPI } from '../../services/api';
import { HiOutlineXMark, HiOutlinePaperAirplane } from 'react-icons/hi2';

export default function ReplyModal({ isOpen, onClose, message, onSuccess, addToast }) {
  const [replyMsg, setReplyMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!replyMsg.trim()) return;

    setLoading(true);
    try {
      await contactAPI.reply(message.id, { reply_msg: replyMsg });
      addToast('Javob muvaffaqiyatli yuborildi', 'success');
      onSuccess();
      onClose();
      setReplyMsg('');
    } catch (err) {
      addToast('Xatolik yuz berdi: ' + (err.response?.data?.error || err.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !message) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800 }}>Xabarga javob berish</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}><HiOutlineXMark /></button>
        </div>

        <div className="mb-6 p-4 rounded-lg bg-secondary border border-color">
          <div className="flex justify-between mb-2">
            <span className="font-bold text-sm">{message.name}</span>
            <span className="text-xs text-muted">{message.email}</span>
          </div>
          <div className="text-sm font-semibold mb-1">{message.subject}</div>
          <p className="text-sm text-secondary italic">"{message.message}"</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-muted uppercase mb-2 block">Sizning javobingiz (Email orqali yuboriladi)</label>
            <textarea
              required
              className="input w-full"
              style={{ minHeight: '150px' }}
              value={replyMsg}
              onChange={e => setReplyMsg(e.target.value)}
              placeholder="Foydalanuvchiga yozish..."
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button type="button" className="btn btn-ghost flex-1" onClick={onClose}>Bekor qilish</button>
            <button type="submit" className="btn btn-primary flex-1" disabled={loading || !replyMsg.trim()}>
              {loading ? 'Yuborilmoqda...' : (
                <span className="flex items-center justify-center gap-2">
                  <HiOutlinePaperAirplane style={{ transform: 'rotate(-45deg)' }} /> Javobni yuborish
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
