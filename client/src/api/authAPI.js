// client/src/api/authAPI.js
import api from './axiosConfig';

export const registerUser = async ({ username, email, password }) => {
  const { data } = await api.post('/auth/register', { username, email, password });
  return data;
};

export const loginUser = async ({ email, password }) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.put('/auth/profile', payload);
  return data;
};

export const deleteAccount = async () => {
  const { data } = await api.delete('/auth/profile');
  return data;
};
