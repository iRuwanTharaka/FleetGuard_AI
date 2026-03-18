import api from '../api/api';

export const dashboardService = {
  getStats:         () => api.get('/dashboard/stats').then(r => r.data),
  getHealthDist:   () => api.get('/dashboard/health-dist').then(r => r.data),
  getActivityChart: () => api.get('/dashboard/activity').then(r => r.data),
};
