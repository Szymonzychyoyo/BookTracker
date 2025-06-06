const axios = require('axios');

const searchBooks = async (query) => {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;
  const response = await axios.get(url);
  return response.data.docs.slice(0, 10); // tylko 10 wyników
};

module.exports = { searchBooks };
