const express = require('express');
const router = express.Router();
const pool = require('../db');

// Showtimes για συγκεκριμένη παράσταση
router.get('/:show_id', async (req, res) => {
    const { show_id } = req.params;
    try {
        const conn = await pool.getConnection();
        const showtimes = await conn.query(
            'SELECT * FROM showtimes WHERE show_id = ?',
            [show_id]
        );
        conn.release();
        res.json(showtimes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;