import axios from 'axios';

const base = 'http://localhost:8081/catalog';

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token') || localStorage.getItem('user_token') || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const catalogService = {
  // trains
  listTrains: async () => (await axios.get(`${base}/trains`, { headers: getAuthHeaders() })).data,
  createTrain: async (payload) => (await axios.post(`${base}/trains`, payload, { headers: getAuthHeaders() })).data,
  updateTrain: async (id, payload) => (await axios.put(`${base}/trains/${id}`, payload, { headers: getAuthHeaders() })).data,
  deleteTrain: async (id) => (await axios.delete(`${base}/trains/${id}`, { headers: getAuthHeaders() })).data,
  // carriages
  listCarriages: async () => (await axios.get(`${base}/carriages`, { headers: getAuthHeaders() })).data,
  createCarriage: async (payload) => (await axios.post(`${base}/carriages`, payload, { headers: getAuthHeaders() })).data,
  updateCarriage: async (id, payload) => (await axios.put(`${base}/carriages/${id}`, payload, { headers: getAuthHeaders() })).data,
  deleteCarriage: async (id) => (await axios.delete(`${base}/carriages/${id}`, { headers: getAuthHeaders() })).data,
  // seats
  listSeats: async () => (await axios.get(`${base}/seats`, { headers: getAuthHeaders() })).data,
  createSeat: async (payload) => (await axios.post(`${base}/seats`, payload, { headers: getAuthHeaders() })).data,
  updateSeat: async (id, payload) => (await axios.put(`${base}/seats/${id}`, payload, { headers: getAuthHeaders() })).data,
  deleteSeat: async (id) => (await axios.delete(`${base}/seats/${id}`, { headers: getAuthHeaders() })).data,
  // routes
  listRoutes: async () => (await axios.get(`${base}/routes`, { headers: getAuthHeaders() })).data,
  createRoute: async (payload) => (await axios.post(`${base}/routes`, payload, { headers: getAuthHeaders() })).data,
  updateRoute: async (id, payload) => (await axios.put(`${base}/routes/${id}`, payload, { headers: getAuthHeaders() })).data,
  deleteRoute: async (id) => (await axios.delete(`${base}/routes/${id}`, { headers: getAuthHeaders() })).data,
  // prices
  listPrices: async () => (await axios.get(`${base}/prices`, { headers: getAuthHeaders() })).data,
  createPrice: async (payload) => (await axios.post(`${base}/prices`, payload, { headers: getAuthHeaders() })).data,
  updatePrice: async (id, payload) => (await axios.put(`${base}/prices/${id}`, payload, { headers: getAuthHeaders() })).data,
  deletePrice: async (id) => (await axios.delete(`${base}/prices/${id}`, { headers: getAuthHeaders() })).data,
};

export default catalogService;


