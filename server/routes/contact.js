const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const sendEmail = require('../utils/email');
const mockDB = require('../data/mockDB');

// Use messages from mockDB
let messages = mockDB.messages;
let nextId = Math.max(...messages.map(m => m.id), 0) + 1;

// POST send message (Open to Public / Optional Login)
router.post('/', (req, res) => {
  const { name, email, subject, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Barcha maydonlar majburiy' });
  }

  // Parse token optionally if available to link logged-in user
  let userId = null;
  let userEmail = email;

  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET || 'namdtu-att-jwt-secret-key-2026';
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded) {
        userId = decoded.id;
        userEmail = decoded.email || email;
      }
    } catch (err) {
      // Ignore token verification errors for public guests
    }
  }

  const newMsg = { 
    id: nextId++, 
    userId, 
    name, 
    email: userEmail, 
    subject: subject || 'Yangi xabar', 
    message, 
    created_at: new Date().toISOString(), 
    replied: false,
    reply_msg: null,
    replied_at: null
  };

  messages.push(newMsg);
  mockDB.messages = messages;
  res.json({ success: true, message: 'Xabaringiz muvaffaqiyatli yuborildi!' });
});

// GET all messages (Admin Only)
router.get('/', auth, adminOnly, (req, res) => {
  res.json(messages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
});

// POST reply to message (Admin Only)
router.post('/reply/:id', auth, adminOnly, async (req, res) => {
  const id = parseInt(req.params.id);
  const { reply_msg } = req.body;

  if (!reply_msg) {
    return res.status(400).json({ error: 'Javob matni bo\'sh bo\'lmasligi kerak' });
  }

  const msgIdx = messages.findIndex(m => m.id === id);
  if (msgIdx === -1) {
    return res.status(404).json({ error: 'Xabar topilmadi' });
  }

  const originalMsg = messages[msgIdx];

  try {
    await sendEmail({
      to: originalMsg.email,
      subject: `Re: ${originalMsg.subject} - NamDTU ATT Kafedrasi`,
      text: `Assalomu alaykum, ${originalMsg.name}!\n\nSizning xabaringizga javob:\n\n${reply_msg}\n\n--\nHurmat bilan,\nNamDTU ATT Kafedrasi`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #2563eb;">NamDTU ATT Kafedrasi</h2>
          <p>Assalomu alaykum, <b>${originalMsg.name}</b>!</p>
          <p>Sizning xabaringizga javob yo'llandi:</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            ${reply_msg.replace(/\n/g, '<br/>')}
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #64748b; font-size: 0.85rem;">Bu xat avtomatik ravishda yuborildi. Iltimos, unga javob qaytarmang.</p>
        </div>
      `
    });

    messages[msgIdx] = {
      ...originalMsg,
      replied: true,
      reply_msg,
      replied_at: new Date().toISOString()
    };
    mockDB.messages = messages;

    res.json({ success: true, message: 'Javob email orqali yuborildi!' });
  } catch (error) {
    res.status(500).json({ error: 'Email yuborishda xatolik yuz berdi: ' + error.message });
  }
});

// DELETE message (Admin Only)
router.delete('/:id', auth, adminOnly, (req, res) => {
  const id = parseInt(req.params.id);
  const idx = messages.findIndex(m => m.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Topilmadi' });

  messages.splice(idx, 1);
  mockDB.messages = messages;
  res.json({ success: true, message: 'Xabar o\'chirildi' });
});

module.exports = router;
