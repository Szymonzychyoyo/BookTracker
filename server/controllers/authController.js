// server/controllers/authController.js
const User = require('../models/User');
const Book = require('../models/Book');
const jwt = require('jsonwebtoken');

// Generuje token JWT na podstawie user._id
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
      token: generateToken(user._id),
      profileImage: user.profileImage || null
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
      token: generateToken(user._id),
      profileImage: user.profileImage || null
    });
  } else {
    res.status(401).json({ message: 'Nieprawidłowe dane logowania' });
  }
};

// @desc    Aktualizuj profil użytkownika (username i/lub hasło)
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Użytkownik nie znaleziony' });

    const { username, oldPassword, newPassword, confirmPassword } = req.body;

    // zmiana loginu
    if (username) {
      user.username = username.trim();
    }

    // zmiana hasła
    if (oldPassword || newPassword || confirmPassword) {
      if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
          message: 'Aby zmienić hasło, podaj stare hasło, nowe hasło i potwierdzenie'
        });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          message: 'Nowe hasło i jego potwierdzenie nie są zgodne'
        });
      }
      const isMatch = await user.matchPassword(oldPassword);
      if (!isMatch) {
        return res.status(401).json({ message: 'Stare hasło jest nieprawidłowe' });
      }
      user.password = newPassword; // zahashuje się w pre('save')
    }

    await user.save();

    // nowy token
    const token = generateToken(user._id);
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
      profileImage: user.profileImage || null,
      message: 'Profil zaktualizowany'
    });
  } catch (error) {
    console.error('Błąd podczas aktualizacji profilu:', error.message);
    res.status(500).json({ message: 'Wewnętrzny błąd serwera' });
  }
};

// @desc    Zaktualizuj avatar użytkownika
// @route   PUT /api/auth/profile/avatar
// @access  Private
const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Brak pliku avatar' });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
    }
    user.profileImage = `/uploads/avatars/${req.file.filename}`;
    await user.save();
    res.json({ profileImage: user.profileImage });
  } catch (error) {
    console.error('Błąd podczas uploadu avatara:', error.message);
    res.status(500).json({ message: 'Wewnętrzny błąd serwera' });
  }
};

// @desc    Usuń konto użytkownika i jego książki
// @route   DELETE /api/auth/profile
// @access  Private
const deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    await Book.deleteMany({ owner: userId });
    await User.findByIdAndDelete(userId);
    res.json({ message: 'Twoje konto i wszystkie Twoje książki zostały usunięte' });
  } catch (error) {
    console.error('Błąd podczas usuwania konta:', error.message);
    res.status(500).json({ message: 'Wewnętrzny błąd serwera' });
  }
};

module.exports = {
  register,
  login,
  updateProfile,
  updateAvatar,
  deleteProfile,
};
