// server/controllers/bookController.js
const Book = require("../models/Book");

// @desc    Pobierz wszystkie książki
// @route   GET /api/books
// @access  Public (na razie, bez autoryzacji)
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.error("Błąd podczas pobierania książek:", error.message);
    res.status(500).json({ message: "Wewnętrzny błąd serwera" });
  }
};

// @desc    Dodaj nową książkę (z opcjonalnymi danymi z Open Library)
// @route   POST /api/books
// @access  Public (na razie)
const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      openLibraryId = "",
      coverId = null,
      authorKey = [],
      status = "to-read",
    } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: "Podaj tytuł i autora książki" });
    }

    const newBook = new Book({
      title,
      author,
      openLibraryId,
      coverId,
      authorKey,
      status,
    });
    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.error("Błąd podczas tworzenia książki:", error.message);
    res.status(500).json({ message: "Wewnętrzny błąd serwera" });
  }
};

// @desc    Zaktualizuj status książki (to-read ↔ read)
// @route   PATCH /api/books/:id
// @access  Public (na razie, bez autoryzacji)
const updateBookStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["to-read", "read"].includes(status)) {
      return res.status(400).json({ message: "Nieprawidłowy status książki" });
    }
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Książka nie znaleziona" });
    }
    book.status = status;
    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    console.error("Błąd podczas aktualizacji książki:", error.message);
    res.status(500).json({ message: "Wewnętrzny błąd serwera" });
  }
};

// @desc    Usuń książkę
// @route   DELETE /api/books/:id
// @access  Public (na razie, bez autoryzacji)
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Book.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Książka nie znaleziona" });
    }
    res.json({ message: "Książka usunięta" });
  } catch (error) {
    console.error("Błąd podczas usuwania książki:", error.message);
    res.status(500).json({ message: "Wewnętrzny błąd serwera" });
  }
};

module.exports = {
  getAllBooks,
  createBook,
  updateBookStatus,
  deleteBook,
};
