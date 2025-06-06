// server/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Trasy dla Open Library (zewnętrzne API)
const openLibraryRoutes = require("./routes/openLibraryRoutes");
app.use("/api/openlibrary", openLibraryRoutes);

// ←––––––––––– tutaj dodajemy trasy dla Books –––––––––––→
const bookRoutes = require("./routes/bookRoutes");
app.use("/api/books", bookRoutes);

// ---------------------------------------------

const PORT = process.env.PORT || 5001; // upewnij się, że to jest 5001 (albo 5000, jeśli wróciłeś do 5000)
app.listen(PORT, () => {
  console.log(`🚀 Serwer działa na porcie ${PORT}`);
});
