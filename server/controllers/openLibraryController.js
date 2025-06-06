const { searchBooks } = require('../services/openLibraryService');

const handleSearch = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: 'Brakuje parametru `q` w zapytaniu' });
    }
    const books = await searchBooks(query);
    res.json(books);
  } catch (error) {
    console.error('Błąd API OpenLibrary:', error.message);
    res.status(500).json({ message: 'Błąd pobierania danych z OpenLibrary' });
  }
};

module.exports = { handleSearch };
