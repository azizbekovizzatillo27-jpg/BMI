const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/schedule.json');

// Helper to read data
const readData = () => {
    try {
        const data = fs.readFileSync(DATA_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Schedule data read error:', err);
        return { directions: [], groups: [], schedules: {} };
    }
};

// Helper to write data
const writeData = (data) => {
    try {
        fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error('Schedule data write error:', err);
        return false;
    }
};

// Public: Get all directions
router.get('/directions', (req, res) => {
    const data = readData();
    res.json(data.directions);
});

// Public: Get groups for a direction
router.get('/groups/:directionId', (req, res) => {
    const data = readData();
    const filteredGroups = data.groups.filter(g => g.directionId === req.params.directionId);
    res.json(filteredGroups);
});

// Public: Get schedule for a specific group
router.get('/group/:groupId', (req, res) => {
    const data = readData();
    const schedule = data.schedules[req.params.groupId] || {
        monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: []
    };
    res.json({ groupId: req.params.groupId, schedule });
});

// Admin: Update schedule for a group
router.post('/updatelist', (req, res) => {
    // In a real app, check req.user for admin role here
    const { groupId, schedule } = req.body;
    if (!groupId || !schedule) return res.status(400).json({ error: 'Missing data' });

    const data = readData();
    data.schedules[groupId] = schedule;
    
    if (writeData(data)) {
        res.json({ success: true, message: 'Jadval yangilandi' });
    } else {
        res.status(500).json({ error: 'Server xatosi' });
    }
});

// Admin: Manage groups/directions (Simplified for MVP)
router.post('/manage', (req, res) => {
    const { directions, groups, addGroup, deleteGroupId } = req.body;
    const data = readData();
    
    if (directions) data.directions = directions;
    if (groups) data.groups = groups;
    
    if (addGroup) {
        const { name, directionId } = addGroup;
        const id = name.trim().replace(/\s+/g, '-').toUpperCase();
        
        // Prevent duplicates
        if (!data.groups.some(g => g.id === id)) {
            data.groups.push({ id, directionId, name: name.trim() });
            data.schedules[id] = {
                monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: []
            };
        }
    }

    if (deleteGroupId) {
        data.groups = data.groups.filter(g => g.id !== deleteGroupId);
        delete data.schedules[deleteGroupId];
    }
    
    if (writeData(data)) {
        res.json({ success: true, message: 'Ma\'lumotlar yangilandi' });
    } else {
        res.status(500).json({ error: 'Server xatosi' });
    }
});

module.exports = router;
