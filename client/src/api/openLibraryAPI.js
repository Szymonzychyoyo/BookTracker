// client/src/api/openLibraryAPI.js
import axios from 'axios';

/**
 * Wysyła zapytanie do naszego backendu:
 * GET /api/openlibrary/search?q=<query>
 * Zwraca tablicę książek (danych z Open Library).
 */
export const searchBooksOpenLibrary = async (query) => {
  try {
    // dzięki ustawionemu proxy w package.json wysyłamy zapytanie do /api/openlibrary/...
    const response = await axios.get(`/api/openlibrary/search?q=${encodeURIComponent(query)}`);
    return response.data; // tablica obiektów z Open Library
  } catch (error) {
    console.error('Błąd podczas wyszukiwania w OpenLibrary:', error);
    throw error;
  }
};
