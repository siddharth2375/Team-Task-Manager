import api from './axios.js';

export const searchUsers = (search) => api.get('/users', { params: { search } });
