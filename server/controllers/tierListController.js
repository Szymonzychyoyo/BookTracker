const { validationResult } = require('express-validator');
const TierList = require('../models/TierList');

const DEFAULT_TIERS = ['S', 'A', 'B', 'C', 'D', 'F'];

// POST /api/tierlists - create new tier list
const createTierList = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name } = req.body;
    const tiers = DEFAULT_TIERS.map(label => ({ label, books: [] }));
    const list = await TierList.create({ name, owner: req.user._id, tiers });
    res.status(201).json(list);
  } catch (err) {
    console.error('createTierList error', err.message);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

// PATCH /api/tierlists/:id - update tiers
const updateTierList = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const { tiers } = req.body;
    const list = await TierList.findOne({ _id: id, owner: req.user._id });
    if (!list) return res.status(404).json({ message: 'Tier lista nie znaleziona' });
    list.tiers = tiers;
    await list.save();
    res.json(list);
  } catch (err) {
    console.error('updateTierList error', err.message);
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

module.exports = {
  createTierList,
  updateTierList
};