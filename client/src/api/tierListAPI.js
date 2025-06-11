import api from './axiosConfig';

export const createTierList = async (name) => {
  const { data } = await api.post('/tierlists', { name });
  return data;
};

export const updateTierList = async (id, tiers) => {
  const { data } = await api.patch(`/tierlists/${id}`, { tiers });
  return data;
};

export const getTierLists = async () => {
  const { data } = await api.get('/tierlists');
  return data;
};

export const deleteTierList = async (id) => {
  const { data } = await api.delete(`/tierlists/${id}`);
  return data;
};