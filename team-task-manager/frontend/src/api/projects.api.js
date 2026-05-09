import api from './axios.js';

export const listProjects = () => api.get('/projects');
export const getProject = (id) => api.get(`/projects/${id}`);
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.patch(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);
export const addMember = (id, data) => api.post(`/projects/${id}/members`, data);
export const removeMember = (id, userId) => api.delete(`/projects/${id}/members/${userId}`);
export const updateMemberRole = (id, userId, data) =>
  api.patch(`/projects/${id}/members/${userId}/role`, data);
