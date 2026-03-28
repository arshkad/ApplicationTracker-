import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Applications
export const getApplications = (params) => api.get('/applications', { params });
export const getApplication = (id) => api.get(`/applications/${id}`);
export const createApplication = (data) => api.post('/applications', data);
export const updateApplication = (id, data) => api.put(`/applications/${id}`, data);
export const deleteApplication = (id) => api.delete(`/applications/${id}`);
export const getAnalytics = () => api.get('/applications/analytics');

// Interviews
export const getInterviews = (appId) => api.get(`/applications/${appId}/interviews`);
export const createInterview = (appId, data) => api.post(`/applications/${appId}/interviews`, data);
export const updateInterview = (id, data) => api.put(`/interviews/${id}`, data);
export const deleteInterview = (id) => api.delete(`/interviews/${id}`);

export default api;
