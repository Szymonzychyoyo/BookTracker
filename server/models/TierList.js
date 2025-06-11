const mongoose = require('mongoose');

const tierSchema = new mongoose.Schema({
  label: { type: String, required: true },
  books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
});

const tierListSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tiers: { type: [tierSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('TierList', tierListSchema);