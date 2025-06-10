// client/src/api/openLibraryAPI.js
import api from './axiosConfig';

/**
 * Wyszukaj książki
 */
export const searchBooksOpenLibrary = async (query) => {
  const { data } = await api.get(`/openlibrary/search?q=${encodeURIComponent(query)}`);
  return data;
};

/**
 * Pobierz profil autora
 */
export const getAuthorDetails = async (authorKey) => {
  const { data } = await api.get(`/openlibrary/authors/${authorKey}`);
  return data;
};

/**
 * Pobierz szczegóły pracy (opis)
 */
export const getWorkDetails = async (workKey) => {
  const { data } = await api.get(`/openlibrary/works/${workKey}`);
  return data;
};
