// server/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// --- DODAJ TO: ---
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
// --- KONIEC DODATKU ---

const openLibraryRoutes = require('./routes/openLibraryRoutes');
app.use('/api/openlibrary', openLibraryRoutes);

const bookRoutes = require('./routes/bookRoutes');
app.use('/api/books', bookRoutes);

const tierListRoutes = require('./routes/tierListRoutes');
app.use('/api/tierlists', tierListRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/brakOkladki', express.static(path.join(__dirname, 'brakOkladki')));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Serwer działa na porcie ${PORT}`);
});