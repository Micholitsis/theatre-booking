const express = require('express');
const router = express.Router();
const pool = require('../db');

// Όλα τα θέατρα
router.get('/', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const theatres = await conn.query('SELECT * FROM theatres');
        conn.release();
        res.json(theatres);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Αναζήτηση θεάτρου με όνομα ή τοποθεσία
router.get('/search', async (req, res) => {
    const { q } = req.query;
    try {
        const conn = await pool.getConnection();
        const theatres = await conn.query(
            'SELECT * FROM theatres WHERE name LIKE ? OR location LIKE ?',
            [`%${q}%`, `%${q}%`]
        );
        conn.release();
        res.json(theatres);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;