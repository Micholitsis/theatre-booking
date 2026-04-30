# Theatre Booking App

Εφαρμογή κράτησης θέσεων σε θεατρικές παραστάσεις.

## Τεχνολογίες

- **Frontend**: React Native (Expo)
- **Backend**: Node.js & Express
- **Database**: MariaDB

## Εγκατάσταση

### Backend
cd backend
npm install
node index.js

### Frontend
cd frontend
npx expo start

## Λειτουργίες

- Εγγραφή και σύνδεση χρηστών
- Προβολή θεάτρων και παραστάσεων
- Κράτηση θέσεων
- Διαχείριση κρατήσεων

## API Endpoints

- POST /auth/register - Εγγραφή χρήστη
- POST /auth/login - Σύνδεση χρήστη
- GET /theatres - Λίστα θεάτρων
- GET /shows - Λίστα παραστάσεων
- GET /showtimes/:show_id - Ώρες παράστασης
- POST /reservations - Νέα κράτηση
- GET /reservations/my - Οι κρατήσεις μου
- DELETE /reservations/:id - Ακύρωση κράτησης