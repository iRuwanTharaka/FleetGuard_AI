import api from '../api/api';

const managerService = {
  // ─── DASHBOARD ───────────────────────────────────────────
  getDashboardStats: () =>
    api.get('/manager/dashboard/stats').then((r) => r.data),

  getDashboardActivity: () =>
    api.get('/manager/dashboard/activity').then((r) => r.data),

  getHealthDistribution: () =>
    api.get('/manager/fleet/health-distribution').then((r) => r.data),

  getRecentAlerts: (limit = 5) =>
    api.get(`/manager/recent-alerts?limit=${limit}`).then((r) => r.data),

  // ─── INSPECTIONS ─────────────────────────────────────────
  getInspectionsSummary: () =>
    api.get('/manager/inspections-summary').then((r) => r.data),

  getInspections: (params = {}) => {
    const filtered = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v != null && v !== '')
    );
    const qs = new URLSearchParams(filtered).toString();
    return api.get(`/manager/inspections?${qs}`).then((r) => r.data);
  },

  reviewInspection: (id, { review_status, manager_notes }) =>
    api
      .patch(`/inspections/${id}/review`, { review_status, manager_notes })
      .then((r) => r.data),

  // ─── VEHICLES ────────────────────────────────────────────
  getAllVehicles: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/vehicles?${qs}`).then((r) => r.data);
  },

  getVehicleById: (id) => api.get(`/vehicles/${id}`).then((r) => r.data),

  getVehicleInspectionHistory: (id) =>
    api.get(`/vehicles/${id}/inspection-history`).then((r) => r.data),

  updateVehicleStatus: (id, status, notes = '') =>
    api.patch(`/vehicles/${id}/status`, { status, notes }).then((r) => r.data),

  createVehicle: (data) => api.post('/vehicles', data).then((r) => r.data),

  updateVehicle: (id, data) =>
    api.put(`/vehicles/${id}`, data).then((r) => r.data),

  deleteVehicle: (id) => api.delete(`/vehicles/${id}`).then((r) => r.data),

  // ─── SPRINT 5: Smart Assignment + Map View ─────────────────────
  getSmartAssignmentRecommendations: (customerTier, pickupLat, pickupLng) =>
    api
      .post('/manager/smart-assignment', {
        customerTier,
        pickupLat,
        pickupLng,
      })
      .then((r) => r.data),

  getVehicleLocations: (filter = 'all') =>
    api.get(`/manager/vehicles/locations?filter=${filter}`).then((r) => r.data),

  // ─── SPRINT 6: Analytics ─────────────────────────────────────
  getHealthTrend: (days = 30) =>
    api.get(`/manager/analytics/health-trend?days=${days}`).then((r) => r.data?.data || []),

  getDamageTypes: (days = 30) =>
    api.get(`/manager/analytics/damage-types?days=${days}`).then((r) => r.data?.data || []),

  getTopDamaged: (days = 30) =>
    api.get(`/manager/analytics/top-damaged?days=${days}`).then((r) => r.data?.data || []),
};

export default managerService;
