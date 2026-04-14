import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
});

export const getJobs = () => API.get('/jobs');
export const createJob = (data) => API.post('/jobs', data);
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);
export const acceptJob = (id, acceptedBy) =>
  API.patch(`/jobs/${id}/accept`, { acceptedBy });