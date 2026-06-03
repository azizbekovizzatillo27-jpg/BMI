const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// Get statistics
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM statistics WHERE id = 1');
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      // Fallback defaults
      res.json({
        students: 1250, teachers: 35, graduates: 4500, labs: 8,
        partners: 12, years_active: 15, programs: 5, research_papers: 120,
        news_count: 45, messages_count: 15
      });
    }
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Update statistics
router.put('/', auth, adminOnly, async (req, res) => {
  try {
    const { students, teachers, graduates, labs, partners, years_active, programs, research_papers } = req.body;
    
    // Ensure the row exists
    await db.query('INSERT IGNORE INTO statistics (id) VALUES (1)');
    
    await db.query(`
      UPDATE statistics SET 
        students = ?, teachers = ?, graduates = ?, labs = ?, 
        partners = ?, years_active = ?, programs = ?, research_papers = ?
      WHERE id = 1
    `, [
      students || 0, teachers || 0, graduates || 0, labs || 0,
      partners || 0, years_active || 0, programs || 0, research_papers || 0
    ]);
    
    res.json({ message: 'Statistics updated successfully' });
  } catch (error) {
    console.error('Stats update error:', error);
    res.status(500).json({ error: 'Failed to update statistics' });
  }
});

module.exports = router;
