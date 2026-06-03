const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const DEFAULT_STATS = {
  students: 1250, teachers: 35, graduates: 4500, labs: 8,
  partners: 12, years_active: 15, programs: 5, research_papers: 120,
  news_count: 45, messages_count: 15
};

// Auto-create table and insert default row
const ensureStatsTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS statistics (
        id INT PRIMARY KEY DEFAULT 1,
        students INT DEFAULT 1250,
        teachers INT DEFAULT 35,
        graduates INT DEFAULT 4500,
        labs INT DEFAULT 8,
        partners INT DEFAULT 12,
        years_active INT DEFAULT 15,
        programs INT DEFAULT 5,
        research_papers INT DEFAULT 120,
        news_count INT DEFAULT 45,
        messages_count INT DEFAULT 15
      )
    `);
    await db.query('INSERT IGNORE INTO statistics (id) VALUES (1)');
  } catch (e) {
    console.error('Stats table init error:', e.message);
  }
};
ensureStatsTable();

// Get statistics - NEVER returns 500, always returns data
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM statistics WHERE id = 1');
    res.json(rows.length > 0 ? rows[0] : DEFAULT_STATS);
  } catch (error) {
    console.error('Stats fetch error:', error.message);
    // Return defaults instead of crashing
    res.json(DEFAULT_STATS);
  }
});

// Update statistics
router.put('/', auth, adminOnly, async (req, res) => {
  try {
    const { students, teachers, graduates, labs, partners, years_active, programs, research_papers } = req.body;

    await ensureStatsTable();

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
    console.error('Stats update error:', error.message);
    res.status(500).json({ error: 'Failed to update statistics' });
  }
});

module.exports = router;
