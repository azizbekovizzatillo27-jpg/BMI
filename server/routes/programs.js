const express = require('express');
const router = express.Router();
const mockDB = require('../data/mockDB');
const { autoTranslateObject } = require('../utils/translate');

// Use programs from mockDB
let programs = mockDB.programs;

router.get('/', (req, res) => {
  const { level } = req.query;
  if (level) return res.json(mockDB.programs.filter(p => p.level === level));
  res.json(mockDB.programs);
});

router.get('/:id', (req, res) => {
  const item = mockDB.programs.find(p => p.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: 'Yo\'nalish topilmadi' });
  res.json(item);
});

router.post('/', async (req, res) => {
  req.body = await autoTranslateObject(req.body, ['title', 'type', 'duration', 'desc']);
  const newItem = { id: Date.now(), ...req.body };
  mockDB.programs.push(newItem);
  res.status(201).json(newItem);
});

router.put('/:id', async (req, res) => {
  req.body = await autoTranslateObject(req.body, ['title', 'type', 'duration', 'desc']);
  const id = parseInt(req.params.id);
  const index = mockDB.programs.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ error: 'Topilmadi' });
  mockDB.programs[index] = { ...mockDB.programs[index], ...req.body };
  res.json(mockDB.programs[index]);
});

router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  mockDB.programs = mockDB.programs.filter(p => p.id !== id);
  res.json({ message: 'O\'chirildi' });
});

module.exports = router;
