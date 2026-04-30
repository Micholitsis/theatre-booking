const express = require('express');
const router = express.Router();
const pool = require('../db');

// Όλες οι παραστάσεις
router.get('/', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const shows = await conn.query(
            'SELECT shows.*, theatres.name AS theatre_name, theatres.location FROM shows JOIN theatres ON shows.theatre_id = theatres.theatre_id'
        );
        conn.release();
        res.json(shows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Αναζήτηση παράστασης
router.get('/search', async (req, res) => {
    const { q } = req.query;
    try {
        const conn = await pool.getConnection();
        const shows = await conn.query(
            'SELECT shows.*, theatres.name AS theatre_name FROM shows JOIN theatres ON shows.theatre_id = theatres.theatre_id WHERE shows.title LIKE ?',
            [`%${q}%`]
        );
        conn.release();
        res.json(shows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;