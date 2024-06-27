const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');
const generateToken = require('../utils/generateToken');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    try {
        const user = await db.createUser(username, password);
        
        const token = generateToken({ id: user.id, username: user.username });
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await db.getUserByUsername(username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = generateToken({ id: user.id, username: user.username });
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
