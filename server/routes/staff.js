const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const upload = require('../middleware/upload');
const mockDB = require('../data/mockDB');
const { autoTranslateObject } = require('../utils/translate');

// Use staff from mockDB
let staffData = mockDB.staff;
let nextStaffId = Math.max(...staffData.map(s => s.id), 0) + 1;

router.get('/', (req, res) => {
  res.json(staffData);
});

router.get('/:id', (req, res) => {
  const person = staffData.find(s => s.id === parseInt(req.params.id));
  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ error: 'Xodim topilmadi' });
  }
});

router.post('/', auth, adminOnly, upload.single('photo'), async (req, res) => {
  req.body = await autoTranslateObject(req.body, ['name', 'position', 'bio', 'degree']);
  const newItem = {
    id: nextStaffId++,
    ...req.body,
    photo: req.file ? `/uploads/${req.file.filename}` : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800",
    articles: parseInt(req.body.articles) || 0,
    experience: parseInt(req.body.experience) || 0
  };

  staffData.push(newItem);
  mockDB.staff = staffData;
  res.json(newItem);
});

router.put('/:id', auth, adminOnly, upload.single('photo'), async (req, res) => {
  req.body = await autoTranslateObject(req.body, ['name', 'position', 'bio', 'degree']);
  const id = parseInt(req.params.id);
  const idx = staffData.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Topilmadi' });

  const updatedItem = {
    ...staffData[idx],
    ...req.body,
    photo: req.file ? `/uploads/${req.file.filename}` : staffData[idx].photo,
    articles: parseInt(req.body.articles) || staffData[idx].articles,
    experience: parseInt(req.body.experience) || staffData[idx].experience
  };

  staffData[idx] = updatedItem;
  mockDB.staff = staffData;
  res.json(updatedItem);
});

router.delete('/:id', auth, adminOnly, (req, res) => {
  const id = parseInt(req.params.id);
  const idx = staffData.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Topilmadi' });

  staffData.splice(idx, 1);
  mockDB.staff = staffData;
  res.json({ message: 'O\'chirildi' });
});

module.exports = router;
