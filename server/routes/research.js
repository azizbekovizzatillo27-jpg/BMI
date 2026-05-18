const express = require('express');
const router = express.Router();
const mockDB = require('../data/mockDB');
const { autoTranslateObject } = require('../utils/translate');

// Use research from mockDB
let researchData = mockDB.research;

router.get('/', (req, res) => {
  res.json(mockDB.research);
});

router.post('/', async (req, res) => {
  req.body = await autoTranslateObject(req.body, ['title', 'desc']);
  const newItem = { id: Date.now(), ...req.body };
  mockDB.research.push(newItem);
  res.status(201).json(newItem);
});

router.put('/:id', async (req, res) => {
  req.body = await autoTranslateObject(req.body, ['title', 'desc']);
  const id = parseInt(req.params.id);
  const index = mockDB.research.findIndex(r => r.id === id);
  if (index === -1) return res.status(404).json({ error: 'Topilmadi' });
  mockDB.research[index] = { ...mockDB.research[index], ...req.body };
  res.json(mockDB.research[index]);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  mockDB.research = mockDB.research.filter(r => r.id !== id);
  res.json({ message: 'O\'chirildi' });
});

module.exports = router;
