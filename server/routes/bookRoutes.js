// server/routes/bookRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getAllBooks,
  createBook,
  updateBookStatus,
  deleteBook,
} = require("../controllers/bookController");

// GET    /api/books        → pobierz wszystkie książki
router.get("/", protect, getAllBooks);

// POST   /api/books        → dodaj nową książkę
router.post("/", protect, createBook);

// PATCH  /api/books/:id    → zaktualizuj status książki
router.patch("/:id", protect, updateBookStatus);

// DELETE /api/books/:id    → usuń książkę
router.delete("/:id", protect, deleteBook);

module.exports = router;