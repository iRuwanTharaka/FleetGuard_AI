import api from '../api/api';

export const vehicleService = {
  getAll:      (filters={}) => api.get('/vehicles', { params: filters }).then(r => r.data),
  getAvailable:()           => api.get('/vehicles/available').then(r => r.data),
  getOne:      (id)         => api.get(`/vehicles/${id}`).then(r => r.data),
  create:      (body)       => api.post('/vehicles', body).then(r => r.data),
  update:      (id, body)   => api.put(`/vehicles/${id}`, body).then(r => r.data),
  updateStatus:(id, status) => api.patch(`/vehicles/${id}/status`, { status }).then(r => r.data),
};
