const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const theatreRoutes = require('./routes/theatres');
const showRoutes = require('./routes/shows');
const showtimeRoutes = require('./routes/showtimes');
const reservationRoutes = require('./routes/reservations');

app.use('/auth', authRoutes);
app.use('/theatres', theatreRoutes);
app.use('/shows', showRoutes);
app.use('/showtimes', showtimeRoutes);
app.use('/reservations', reservationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});