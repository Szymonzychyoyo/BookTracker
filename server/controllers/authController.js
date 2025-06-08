// server/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generowanie tokena JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @desc    Rejestracja użytkownika
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Wszystkie pola są wymagane' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'Użytkownik już istnieje' });
  }

  const user = await User.create({ username, email, password });
  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    res.status(400).json({ message: 'Nieprawidłowe dane użytkownika' });
  }
};

// @desc    Logowanie użytkownika
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id)
    });
  } else {
    res.status(401).json({ message: 'Nieprawidłowe dane logowania' });
  }
};

module.exports = { register, login };
