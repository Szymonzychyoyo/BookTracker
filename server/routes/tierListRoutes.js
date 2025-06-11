const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { createTierList, updateTierList } = require('../controllers/tierListController');

router.post(
  '/',
  protect,
  body('name').trim().notEmpty().withMessage('Nazwa jest wymagana'),
  createTierList
);

router.patch(
  '/:id',
  protect,
  body('tiers').isArray().withMessage('Tiers must be array'),
  updateTierList
);

module.exports = router;