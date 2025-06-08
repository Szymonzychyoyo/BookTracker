// server/controllers/bookController.js
const Book = require("../models/Book");

// @desc    Pobierz wszystkie książki zalogowanego użytkownika
// @route   GET /api/books
// @access  Private
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(books);
  } catch (error) {
    console.error("Błąd podczas pobierania książek:", error.message);
    res.status(500).json({ message: "Wewnętrzny błąd serwera" });
  }
};

// @desc    Dodaj nową książkę
// @route   POST /api/books
// @access  Private
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
      owner: req.user._id,
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
// @access  Private
const updateBookStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["to-read", "read"].includes(status)) {
      return res.status(400).json({ message: "Nieprawidłowy status książki" });
    }

    const book = await Book.findById(id);
    console.log("🔍 updateBookStatus:", {
      id,
      owner: book?.owner,
      user: req.user._id,
    });

    if (!book || !book.owner.equals(req.user._id)) {
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
// @access  Private
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    // szukamy i usuwamy w jednym kroku, tylko dla zalogowanego właściciela
    const deleted = await Book.findOneAndDelete({
      _id: id,
      owner: req.user._id,
    });

    console.log("🔍 deleteBook:", { id, user: req.user._id, deleted });

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
