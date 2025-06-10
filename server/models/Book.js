const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    openLibraryId: { type: String, trim: true, default: '' },
    coverId: { type: Number, default: null },
    authorKey: { type: [String], default: [] },
    // subjects usunięte
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['to-read','read'], default: 'to-read' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
