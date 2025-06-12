const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const {
  register,
  login,
  updateProfile,
  deleteProfile,
  updateAvatar   
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

router.put('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteProfile);

// nowa trasa:
router.put('/profile/avatar', protect, upload.single('avatar'), updateAvatar);

module.exports = router;
