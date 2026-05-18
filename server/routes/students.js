const express = require('express');
const router = express.Router();
const path = require('path');
const mockDB = require('../data/mockDB');
const upload = require('../middleware/upload');

router.get('/materials', (req, res) => res.json(mockDB.students.materials));
router.get('/theses', (req, res) => res.json(mockDB.students.theses));
router.get('/requirements', (req, res) => res.json(mockDB.students.requirements));

// Materials CRUD
router.post('/materials', upload.single('file'), (req, res) => {
  const { title_uz, title_en, subject, author } = req.body;
  const newItem = { 
    id: Date.now(), 
    title_uz, 
    title_en, 
    subject, 
    author,
    type: req.file ? path.extname(req.file.originalname).replace('.', '') : 'pdf',
    url: req.file ? `/uploads/${req.file.filename}` : '#',
    size: req.file ? `${(req.file.size / (1024 * 1024)).toFixed(1)} MB` : '0 MB'
  };
  mockDB.students.materials.push(newItem);
  res.status(201).json(newItem);
});

router.delete('/materials/:id', (req, res) => {
  const id = parseInt(req.params.id);
  mockDB.students.materials = mockDB.students.materials.filter(m => m.id !== id);
  res.json({ message: 'O\'chirildi' });
});

// Theses CRUD
router.post('/theses', (req, res) => {
  const newItem = { id: Date.now(), ...req.body };
  mockDB.students.theses.push(newItem);
  res.status(201).json(newItem);
});

router.delete('/theses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  mockDB.students.theses = mockDB.students.theses.filter(t => t.id !== id);
  res.json({ message: 'O\'chirildi' });
});

module.exports = router;
