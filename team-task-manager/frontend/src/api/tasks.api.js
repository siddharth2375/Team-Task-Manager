import api from './axios.js';

export const listTasks = (projectId, params) =>
  api.get(`/projects/${projectId}/tasks`, { params });
export const createTask = (projectId, data) =>
  api.post(`/projects/${projectId}/tasks`, data);
export const getTask = (id) => api.get(`/tasks/${id}`);
export const updateTask = (id, data) => api.patch(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
