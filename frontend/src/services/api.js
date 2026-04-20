import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authService = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  signup: (email, password, name) => api.post('/api/auth/signup', { email, password, name }),
};

export const songService = {
  getAll: () => api.get('/api/songs'),
  getTop: (limit = 10) => api.get(`/api/songs/top?limit=${limit}`),
  search: (q) => api.get(`/api/songs/search?q=${q}`),
  getById: (id) => api.get(`/api/songs/${id}`),
  getStreamUrl: (id) => api.get(`/api/songs/${id}/stream`),
};

export const artistService = {
  getAll: () => api.get('/api/artists'),
  getSongs: (id) => api.get(`/api/artists/${id}/songs`),
};

export const playlistService = {
  getAll: () => api.get('/api/playlists'),
  create: (name) => api.post('/api/playlists', { name }),
  addSong: (plId, songId) => api.post(`/api/playlists/${plId}/songs/${songId}`),
  removeSong: (plId, songId) => api.delete(`/api/playlists/${plId}/songs/${songId}`),
};

export default api;
