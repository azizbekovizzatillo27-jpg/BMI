const express = require('express');
const router = express.Router();
const mockDB = require('../data/mockDB');

router.get('/', (req, res) => {
  const newsCount = mockDB.news.length;
  const staffCount = mockDB.staff.length;
  const programsCount = mockDB.programs.length;
  const researchCount = mockDB.research.length;
  
  // Real-time calculations based on existing data
  res.json({
    students: programsCount * 125, // Simulated real ratio (e.g. 125 per program)
    teachers: staffCount,
    programs: programsCount,
    research_papers: researchCount,
    years_active: 15, // Department constant
    graduates: programsCount * 450, // Simulated real ratio
    partners: Math.floor(staffCount / 2),
    labs: Math.max(6, programsCount + 2),
    news_count: newsCount,
    messages_count: mockDB.messages.length
  });
});

module.exports = router;
