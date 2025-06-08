import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';
const api = axios.create({ baseURL: API_BASE });

// Dodaj interceptor, który dołącza token do każdego żądania
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getAllBooks = async () => {
  const { data } = await api.get('/books');
  return data;
};

export const addBook = async (bookData) => {
  const { data } = await api.post('/books', bookData);
  return data;
};

export const updateBookStatus = async (id, status) => {
  const { data } = await api.patch(`/books/${id}`, { status });
  return data;
};

export const deleteBook = async (id) => {
  const { data } = await api.delete(`/books/${id}`);
  return data;
};
