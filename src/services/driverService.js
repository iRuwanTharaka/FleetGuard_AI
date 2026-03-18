import api from '../api/api';

export const driverService = {
  getStats: () => api.get('/driver/stats').then((r) => r.data),
};
