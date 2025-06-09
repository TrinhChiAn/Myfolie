import axios from 'axios';
import { API_URL } from '../config/constants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Request:', config);
  return config;
});

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

export const auth = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password }),
  
  forgotPassword: (email) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token, newPassword) =>
    api.post('/auth/reset-password', { token, newPassword }),
};

export const user = {
  getCurrentUserId: () =>
    api.get('/user/me/id'),
    
  getProfile: (userId) =>
    api.get(`/user/profile/${userId}`),
  
  updateProfile: (data) =>
    api.put('/user/profile', data),
  
  updateProfileImage: (file) => {
    if (!file) {
      return api.delete('/user/profile/image');
    }
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/user/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  changePassword: (data) =>
    api.put('/user/password', data),
};

export const projects = {
  getUserProjects: (userId) =>
    userId === 'me' 
      ? api.get('/user/projects/me')
      : api.get(`/user/projects/${userId}`),
  
  addProject: (data) =>
    api.post('/user/projects', data),
  
  updateProject: (projectId, data) =>
    api.put(`/user/projects/${projectId}`, data),
  
  deleteProject: (projectId) =>
    api.delete(`/user/projects/${projectId}`),
};

export default api; 