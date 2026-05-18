const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');
const upload = require('../middleware/upload');
const mockDB = require('../data/mockDB');
const { autoTranslateObject } = require('../utils/translate');

// Use news from mockDB
let newsData = mockDB.news;
let nextNewsId = Math.max(...newsData.map(n => n.id), 0) + 1;

router.get('/', (req, res) => {
  const { category } = req.query;
  if (category) return res.json(newsData.filter(n => n.category === category));
  res.json(newsData.sort((a, b) => new Date(b.published_at) - new Date(a.published_at)));
});

router.get('/:id', (req, res) => {
  const newsItem = newsData.find(n => n.id === parseInt(req.params.id));
  if (newsItem) {
    newsItem.views += 1;
    res.json(newsItem);
  } else {
    res.status(404).json({ error: 'Yangilik topilmadi' });
  }
});

router.post('/', auth, adminOnly, upload.single('image'), async (req, res) => {
  req.body = await autoTranslateObject(req.body, ['title', 'content']);
  const { title_uz, title_en, content_uz, content_en, category, author } = req.body;
  
  const newNews = {
    id: nextNewsId++,
    title_uz,
    title_en: req.body.title_en,
    title_ru: req.body.title_ru,
    content_uz,
    content_en: req.body.content_en,
    content_ru: req.body.content_ru,
    category,
    author: author || 'Admin',
    image: req.file ? `/uploads/${req.file.filename}` : "https://images.unsplash.com/photo-1562813733-b31f71025d54?w=800",
    published_at: new Date().toISOString().split('T')[0],
    views: 0
  };

  newsData.push(newNews);
  // Sync back to mockDB (though it's a reference, explicitly update for clarity)
  mockDB.news = newsData; 
  res.json(newNews);
});

router.put('/:id', auth, adminOnly, upload.single('image'), async (req, res) => {
  req.body = await autoTranslateObject(req.body, ['title', 'content']);
  const id = parseInt(req.params.id);
  const idx = newsData.findIndex(n => n.id === id);
  
  if (idx === -1) return res.status(404).json({ error: 'Topilmadi' });

  const updatedNews = {
    ...newsData[idx],
    ...req.body,
    image: req.file ? `/uploads/${req.file.filename}` : newsData[idx].image
  };

  newsData[idx] = updatedNews;
  mockDB.news = newsData;
  res.json(updatedNews);
});

router.delete('/:id', auth, adminOnly, (req, res) => {
  const id = parseInt(req.params.id);
  const idx = newsData.findIndex(n => n.id === id);
  
  if (idx === -1) return res.status(404).json({ error: 'Topilmadi' });

  newsData.splice(idx, 1);
  mockDB.news = newsData;
  res.json({ message: 'O\'chirildi' });
});

module.exports = router;
