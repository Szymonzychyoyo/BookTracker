// server/routes/openLibraryRoutes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/openlibrary/search?q=…
router.get('/search', async (req, res) => {
  const { q } = req.query;
  try {
    const { data } = await axios.get('https://openlibrary.org/search.json', {
      params: { q, limit: 50 }
    });
    res.json(data.docs);
  } catch (error) {
    console.error('OpenLibrary search error:', error.message);
    res.json([]); // empty on error
  }
});

// GET /api/openlibrary/authors/:authorKey
router.get('/authors/:authorKey', async (req, res) => {
  const { authorKey } = req.params;
  try {
    const authorRes = await axios.get(`https://openlibrary.org/authors/${authorKey}.json`);
    const worksRes = await axios.get('https://openlibrary.org/search.json', {
      params: { author: authorKey, limit: 20 }
    });
    const author = authorRes.data;
    const works = worksRes.data.docs.map(doc => ({
      key: doc.key,
      title: doc.title,
      cover_i: doc.cover_i
    }));
    res.json({ author, works });
  } catch (error) {
    console.error('OpenLibrary author fetch error:', error.message);
    res.status(500).json({ message: 'Nie udało się pobrać danych autora' });
  }
});

// GET /api/openlibrary/works/:workKey
router.get('/works/:workKey', async (req, res) => {
  const { workKey } = req.params;
  try {
    const { data } = await axios.get(`https://openlibrary.org/works/${workKey}.json`);
    res.json(data);
  } catch (error) {
    console.error('OpenLibrary work fetch error:', error.message);
    res.status(500).json({ message: 'Nie udało się pobrać opisu książki' });
  }
});

module.exports = router;
