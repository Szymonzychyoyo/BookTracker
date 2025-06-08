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

    // 1) zmiana loginu
    if (username) {
      user.username = username.trim();
    }

    // 2) zmiana hasła (jeśli którykolwiek z pól hasła jest podany)
    if (oldPassword || newPassword || confirmPassword) {
      // muszą być wszystkie trzy
      if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({
          message: 'Aby zmienić hasło, podaj stare hasło, nowe hasło i potwierdzenie'
        });
      }
      // nowe i potwierdzenie muszą się zgadzać
      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          message: 'Nowe hasło i jego potwierdzenie nie są zgodne'
        });
      }
      // weryfikacja starego hasła
      const isMatch = await user.matchPassword(oldPassword);
      if (!isMatch) {
        return res.status(401).json({ message: 'Stare hasło jest nieprawidłowe' });
      }
      // wszystko OK → ustaw nowe hasło
      user.password = newPassword; // zostanie zahashowane w pre('save')
    }

    // zapisz zmiany
    await user.save();

    // wygeneruj nowy token
    const token = generateToken(user._id);
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
      message: 'Profil zaktualizowany',
    });
  } catch (error) {
    console.error('Błąd podczas aktualizacji profilu:', error.message);
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
  deleteProfile,
};
