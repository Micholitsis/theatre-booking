const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

// Εγγραφή
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const conn = await pool.getConnection();
        await conn.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        conn.release();
        res.json({ message: 'Ο χρήστης εγγράφηκε επιτυχώς!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Σύνδεση
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const conn = await pool.getConnection();
        const users = await conn.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        conn.release();
        if (users.length === 0) {
            return res.status(401).json({ error: 'Λάθος email ή password' });
        }
        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Λάθος email ή password' });
        }
        const token = jwt.sign(
            { user_id: user.user_id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;