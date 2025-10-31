import api from './api';

export const authService = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),

  register: (userData) => 
    api.post('/auth/register', userData),

  getProfile: () => 
    api.get('/users/me'),

  verifyToken: () => 
    api.get('/auth/verify-token'),
};



export const userService = {
  getAll: () => 
    api.get('/users'),

  create: (userData) => 
    api.post('/users', userData),

  update: (id, userData) => 
    api.put(`/users/${id}`, userData),

  delete: (id) => 
    api.delete(`/users/${id}`),

  getStats: () => 
    api.get('/users/stats'), 

  
  restore: (id) => 
    api.put(`/users/${id}/restore`),

  block: (id) => 
    api.put(`/users/${id}/block`),

  unblock: (id) => 
    api.put(`/users/${id}/unblock`),
};

