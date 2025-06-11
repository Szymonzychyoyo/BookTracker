const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  createTierList,
  updateTierList,
  getTierLists,
  deleteTierList
} = require('../controllers/tierListController');

router.post(
  '/',
  protect,
  body('name').trim().notEmpty().withMessage('Nazwa jest wymagana'),
  createTierList
);

router.get('/', protect, getTierLists);
router.patch(
  '/:id',
  protect,
  body('tiers').isArray().withMessage('Tiers must be array'),
  updateTierList
);

router.delete('/:id', protect, deleteTierList);

module.exports = router;