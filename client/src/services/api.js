import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api` 
    : '/api',
  timeout: 10000,
});

export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  const apiBase = import.meta.env.VITE_API_URL || '';
  return `${apiBase}${cleanUrl}`;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const newsAPI = {
  getAll: (params) => api.get('/news', { params }),
  getById: (id) => api.get(`/news/${id}`),
  create: (data) => api.post('/news', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/news/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/news/${id}`),
};

export const staffAPI = {
  getAll: () => api.get('/staff'),
  getById: (id) => api.get(`/staff/${id}`),
  create: (data) => api.post('/staff', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/staff/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/staff/${id}`),
};

export const programsAPI = {
  getAll: (params) => api.get('/programs', { params }),
  getById: (id) => api.get(`/programs/${id}`),
  create: (data) => api.post('/programs', data),
  update: (id, data) => api.put(`/programs/${id}`, data),
  delete: (id) => api.delete(`/programs/${id}`),
};

export const scheduleAPI = {
  getDirections: () => api.get('/schedule/directions'),
  getGroups: (dirId) => api.get(`/schedule/groups/${dirId}`),
  getByGroup: (groupId) => api.get(`/schedule/group/${groupId}`),
  updateGroupSchedule: (groupId, schedule) => api.post('/schedule/updatelist', { groupId, schedule }),
  manage: (data) => api.post('/schedule/manage', data),
};

export const researchAPI = {
  getAll: (params) => api.get('/research', { params }),
  getById: (id) => api.get(`/research/${id}`),
  create: (data) => api.post('/research', data),
  update: (id, data) => api.put(`/research/${id}`, data),
  delete: (id) => api.delete(`/research/${id}`),
};

export const galleryAPI = {
  getAll: (params) => api.get('/gallery', { params }),
  create: (data) => api.post('/gallery', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/gallery/${id}`),
};

export const contactAPI = {
  send: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  reply: (id, data) => api.post(`/contact/reply/${id}`, data),
  delete: (id) => api.delete(`/contact/${id}`),
};

export const studentsAPI = {
  getMaterials: () => api.get('/students/materials'),
  getTheses: () => api.get('/students/theses'),
  getRequirements: () => api.get('/students/requirements'),
  createMaterial: (data) => api.post('/students/materials', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteMaterial: (id) => api.delete(`/students/materials/${id}`),
  createThesis: (data) => api.post('/students/theses', data),
  deleteThesis: (id) => api.delete(`/students/theses/${id}`),
};

export const statsAPI = {
  getAll: () => api.get('/stats'),
};

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
  getAdmins: () => api.get('/auth/admins'),
  createAdmin: (data) => api.post('/auth/admins', data),
  deleteAdmin: (id) => api.delete(`/auth/admins/${id}`),
};

export default api;
