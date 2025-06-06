// server/routes/bookRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllBooks,
  createBook,
  updateBookStatus,
  deleteBook,
} = require("../controllers/bookController");

// GET    /api/books        → pobierz wszystkie książki
router.get("/", getAllBooks);

// POST   /api/books        → dodaj nową książkę
router.post("/", createBook);

// PATCH  /api/books/:id    → zaktualizuj status książki
router.patch("/:id", updateBookStatus);

// DELETE /api/books/:id    → usuń książkę
router.delete("/:id", deleteBook);

module.exports = router;
