import api from '../api/api';

export const userService = {
  updateProfile: (body) => api.put('/users/me', body).then(r => r.data),
  getDrivers:    ()     => api.get('/users/drivers').then(r => r.data),
};
