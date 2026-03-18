import api from '../api/api';

const base = '/user'; // baseURL already includes /api

export const userService = {
  getPreferences: () =>
    api.get(`${base}/preferences`).then((r) => r.data.data),

  updatePreferences: (data) =>
    api.put(`${base}/preferences`, data).then((r) => r.data),

  updateProfile: (formData) =>
    api.put(`${base}/profile`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),

  changePassword: (currentPassword, newPassword) =>
    api.put(`${base}/change-password`, {
      currentPassword,
      newPassword,
    }).then((r) => r.data),
};
