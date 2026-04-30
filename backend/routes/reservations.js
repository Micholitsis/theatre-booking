const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware για έλεγχο token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Δεν υπάρχει token' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Μη έγκυρο token' });
    }
};

// Δημιουργία κράτησης
router.post('/', verifyToken, async (req, res) => {
    const { showtime_id, seats } = req.body;
    const user_id = req.user.user_id;
    try {
        const conn = await pool.getConnection();
        const showtimes = await conn.query(
            'SELECT * FROM showtimes WHERE showtime_id = ?',
            [showtime_id]
        );
        if (showtimes[0].available_seats < seats) {
            conn.release();
            return res.status(400).json({ error: 'Δεν υπάρχουν αρκετές θέσεις' });
        }
        await conn.query(
            'INSERT INTO reservations (user_id, showtime_id, seats) VALUES (?, ?, ?)',
            [user_id, showtime_id, seats]
        );
        await conn.query(
            'UPDATE showtimes SET available_seats = available_seats - ? WHERE showtime_id = ?',
            [seats, showtime_id]
        );
        conn.release();
        res.json({ message: 'Η κράτηση έγινε επιτυχώς!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Κρατήσεις χρήστη
router.get('/my', verifyToken, async (req, res) => {
    const user_id = req.user.user_id;
    try {
        const conn = await pool.getConnection();
        const reservations = await conn.query(
            `SELECT reservations.*, shows.title, showtimes.show_date, showtimes.show_time 
             FROM reservations 
             JOIN showtimes ON reservations.showtime_id = showtimes.showtime_id
             JOIN shows ON showtimes.show_id = shows.show_id
             WHERE reservations.user_id = ?`,
            [user_id]
        );
        conn.release();
        res.json(reservations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ακύρωση κράτησης
router.delete('/:reservation_id', verifyToken, async (req, res) => {
    const { reservation_id } = req.params;
    const user_id = req.user.user_id;
    try {
        const conn = await pool.getConnection();
        const reservations = await conn.query(
            'SELECT * FROM reservations WHERE reservation_id = ? AND user_id = ?',
            [reservation_id, user_id]
        );
        if (reservations.length === 0) {
            conn.release();
            return res.status(404).json({ error: 'Η κράτηση δεν βρέθηκε' });
        }
        await conn.query(
            'UPDATE showtimes SET available_seats = available_seats + ? WHERE showtime_id = ?',
            [reservations[0].seats, reservations[0].showtime_id]
        );
        await conn.query(
            'DELETE FROM reservations WHERE reservation_id = ?',
            [reservation_id]
        );
        conn.release();
        res.json({ message: 'Η κράτηση ακυρώθηκε επιτυχώς!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;