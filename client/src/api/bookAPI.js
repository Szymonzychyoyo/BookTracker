// client/src/api/bookAPI.js
import api from './axiosConfig';

/**
 * Pobierz wszystkie książki zalogowanego użytkownika
 */
export const getAllBooks = async () => {
  const { data } = await api.get('/books');
  return data;
};

/**
 * Dodaj nową książkę
 */
export const addBook = async (bookData) => {
  const { data } = await api.post('/books', bookData);
  return data;
};

/**
 * Zmień status książki
 */
export const updateBookStatus = async (id, status) => {
  const { data } = await api.patch(`/books/${id}`, { status });
  return data;
};

/**
 * Usuń książkę
 */
export const deleteBook = async (id) => {
  const { data } = await api.delete(`/books/${id}`);
  return data;
};
