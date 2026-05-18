const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const upload = require('../middleware/upload');
const mockDB = require('../data/mockDB');
const { autoTranslateObject } = require('../utils/translate');

// Use gallery from mockDB
let galleryData = mockDB.gallery;
let nextGalleryId = Math.max(...galleryData.map(g => g.id), 0) + 1;

router.get('/', (req, res) => {
  const { category } = req.query;
  if (category) return res.json(galleryData.filter(g => g.category === category));
  res.json(galleryData);
});

router.post('/', auth, adminOnly, upload.single('image'), async (req, res) => {
  req.body = await autoTranslateObject(req.body, ['title']);
  const newItem = {
    id: nextGalleryId++,
    ...req.body,
    image: req.file ? `/uploads/${req.file.filename}` : (req.body.image || "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=800"),
    date: new Date().toISOString().split('T')[0]
  };
  galleryData.push(newItem);
  mockDB.gallery = galleryData;
  res.json(newItem);
});

router.delete('/:id', auth, adminOnly, (req, res) => {
  const id = parseInt(req.params.id);
  const idx = galleryData.findIndex(g => g.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Topilmadi' });
  
  galleryData.splice(idx, 1);
  mockDB.gallery = galleryData;
  res.json({ message: 'O\'chirildi' });
});

module.exports = router;
