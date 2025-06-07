// client/src/api/bookAPI.js
import axios from 'axios';

/**
 * Dodaje nową książkę do naszej bazy (nasz endpoint POST /api/books).
 * @param {Object} bookData – obiekt z polami: title, author, openLibraryId, coverId, authorKey, status
 * @returns – obiekt zapisanej książki
 */
export const addBook = async (bookData) => {
  try {
    const response = await axios.post('/api/books', bookData);
    return response.data;
  } catch (error) {
    console.error('Błąd podczas dodawania książki:', error);
    throw error;
  }
};

/**
 * Pobiera wszystkie książki z bazy
 */
export const getAllBooks = async () => {
  const { data } = await axios.get('/api/books');
  return data;
};

/**
 * Zmienia status książki
 * @param {string} id – _id dokumentu w MongoDB
 * @param {string} status – 'to-read' lub 'read'
 */
export const updateBookStatus = async (id, status) => {
  const { data } = await axios.patch(`/api/books/${id}`, { status });
  return data;
};

/**
 * Usuwa książkę
 * @param {string} id – _id dokumentu
 */
export const deleteBook = async (id) => {
  const { data } = await axios.delete(`/api/books/${id}`);
  return data;
};