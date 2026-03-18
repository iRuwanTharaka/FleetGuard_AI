import api from '../api/api';

export const usersService = {
  getDrivers: () =>
    api.get('/users/drivers').then((r) => r.data.drivers || []),

  getDriverById: (id) =>
    api.get(`/users/drivers/${id}`).then((r) => r.data),

  createDriver: (data) =>
    api.post('/users/drivers', data).then((r) => r.data),

  updateDriver: (id, data) =>
    api.put(`/users/drivers/${id}`, data).then((r) => r.data),

  deleteDriver: (id) =>
    api.delete(`/users/drivers/${id}`).then((r) => r.data),
};
