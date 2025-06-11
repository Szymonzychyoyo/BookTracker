const { validationResult } = require("express-validator");
const TierList = require("../models/TierList");

const DEFAULT_TIERS = ["S", "A", "B", "C", "D", "F"];
// GET /api/tierlists - list user's tier lists
const getTierLists = async (req, res) => {
  try {
    const lists = await TierList.find({ owner: req.user._id }).populate({
      path: "tiers.books",
      select: "title coverId",
    });
    res.json(lists);
  } catch (err) {
    console.error("getTierLists error", err.message);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

// POST /api/tierlists - create new tier list
const createTierList = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { name } = req.body;
    const tiers = DEFAULT_TIERS.map((label) => ({ label, books: [] }));
    const list = await TierList.create({ name, owner: req.user._id, tiers });
    res.status(201).json(list);
  } catch (err) {
    console.error("createTierList error", err.message);
    res.status(500).json({ message: "Błąd serwera" });
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
    if (!list)
      return res.status(404).json({ message: "Tier lista nie znaleziona" });
    list.tiers = tiers;
    await list.save();
    res.json(list);
  } catch (err) {
    console.error("updateTierList error", err.message);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

// DELETE /api/tierlists/:id - remove list
const deleteTierList = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TierList.findOneAndDelete({
      _id: id,
      owner: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Tier lista nie znaleziona" });
    }

    res.json({ message: "Tier lista usunięta" });
  } catch (err) {
    console.error("deleteTierList error", err.message);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

module.exports = {
  createTierList,
  updateTierList,
  getTierLists,
  deleteTierList,
};
