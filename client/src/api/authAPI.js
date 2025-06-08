// client/src/api/authAPI.js
import axios from 'axios';

export const registerUser = async ({ username, email, password }) => {
  const { data } = await axios.post('/api/auth/register', {
    username,
    email,
    password,
  });
  return data; // { _id, username, email, token }
};

export const loginUser = async ({ email, password }) => {
  const { data } = await axios.post('/api/auth/login', {
    email,
    password,
  });
  return data; // { _id, username, email, token }
};
