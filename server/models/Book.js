// server/models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    // Identyfikator z Open Library (z pola "key": "/works/OL82548W")
    openLibraryId: {
      type: String,
      trim: true,
      default: '',
    },
    // Identyfikator okładki z Open Library (pole "cover_i")
    coverId: {
      type: Number,
      default: null,
    },
    // Lista kluczy autorów (pole "author_key": ["OL23919A", ...])
    authorKey: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['to-read', 'read'],
      default: 'to-read',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
