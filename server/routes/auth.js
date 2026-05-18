const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('../config/passport');
const authMiddleware = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const JWT_SECRET = process.env.JWT_SECRET || 'namdtu-att-jwt-secret-key-2026';

// Mock users for demo (no DB required)
const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@namdtu.uz', password: bcrypt.hashSync('admin123', 10), role: 'admin' },
  { id: 2, name: 'Talaba Demo', email: 'talaba@namdtu.uz', password: bcrypt.hashSync('talaba123', 10), role: 'student' }
];
let nextId = 3;

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, studentId } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Barcha maydonlarni to\'ldiring' });
    }
    const exists = mockUsers.find(u => u.email === email);
    if (exists) {
      return res.status(400).json({ error: 'Bu email allaqachon ro\'yxatdan o\'tgan' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: nextId++, name, email, password: hashedPassword, role: 'student', studentId };
    mockUsers.push(newUser);
    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ error: 'Email yoki parol noto\'g\'ri' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: 'Email yoki parol noto\'g\'ri' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/social-login
router.post('/social-login', async (req, res) => {
  try {
    const { email, name, provider, social_id, photo } = req.body;
    
    if (!email || !provider || !social_id) {
      return res.status(400).json({ error: 'Noma\'lum ijtimoiy tarmoq ma\'lumotlari' });
    }

    // Check if user exists with this social ID or email
    let user = mockUsers.find(u => u.social_id === social_id && u.provider === provider);
    
    if (!user) {
      // Check if user with same email exists
      user = mockUsers.find(u => u.email === email);
      
      if (user) {
        // Link social account to existing email account
        user.social_id = social_id;
        user.provider = provider;
        if (!user.photo) user.photo = photo;
      } else {
        // Create new user
        user = {
          id: nextId++,
          name,
          email,
          password: 'social-login-no-password', // Placeholder
          role: 'student',
          provider,
          social_id,
          photo
        };
        mockUsers.push(user);
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, photo: user.photo }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), (req, res) => {
  const user = mockUsers.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role, photo: user.photo });
});

// Admin management routes
router.get('/admins', authMiddleware, adminOnly, (req, res) => {
  const admins = mockUsers.filter(u => u.role === 'admin').map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role }));
  res.json(admins);
});

router.post('/admins', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Barcha maydonlarni to\'ldiring' });
    if (mockUsers.find(u => u.email === email)) return res.status(400).json({ error: 'Bu email allaqachon mavjud' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = { id: nextId++, name, email, password: hashedPassword, role: 'admin' };
    mockUsers.push(newAdmin);
    
    res.json({ id: newAdmin.id, name: newAdmin.name, email: newAdmin.email, role: newAdmin.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/admins/:id', authMiddleware, adminOnly, (req, res) => {
  const id = parseInt(req.params.id);
  if (req.user.id === id) return res.status(400).json({ error: 'O\'zingizni o\'chira olmaysiz' });
  
  const idx = mockUsers.findIndex(u => u.id === id && u.role === 'admin');
  if (idx === -1) return res.status(404).json({ error: 'Admin topilmadi' });
  
  mockUsers.splice(idx, 1);
  res.json({ message: 'Admin o\'chirildi' });
});

// --- REAL GOOGLE AUTH ROUTES ---

// Redirect to Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    try {
      const googleUser = req.user;
      
      // Find or create user in mockUsers
      let user = mockUsers.find(u => u.social_id === googleUser.social_id && u.provider === 'google');
      
      if (!user) {
        user = mockUsers.find(u => u.email === googleUser.email);
        if (user) {
          user.social_id = googleUser.social_id;
          user.provider = 'google';
        } else {
          user = {
            id: nextId++,
            ...googleUser
          };
          mockUsers.push(user);
        }
      }
      
      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Redirect to frontend with token
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      res.redirect(`${clientUrl}/auth-success?token=${token}&user=${encodeURIComponent(JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo
      }))}`);
    } catch (err) {
      console.error('Google Auth Error:', err);
      res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=auth_failed`);
    }
  }
);

module.exports = router;
