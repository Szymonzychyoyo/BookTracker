const express = require('express');
const router = express.Router();
const { register, login, updateProfile, deleteProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// public
router.post('/register', register);
router.post('/login', login);

// private
router.put('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteProfile);

module.exports = router;
