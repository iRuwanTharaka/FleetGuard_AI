import api from '../api/api';

export const authService = {

  register: async ({ name, email, password, role, phone, licenseNumber }) => {
    const { data } = await api.post('/auth/register', { name, email, password, role, phone, licenseNumber });
    localStorage.setItem('fg_token', data.token);
    localStorage.setItem('fg_user',  JSON.stringify(data.user));
    return data;
  },

  login: async ({ email, password }) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('fg_token', data.token);
    localStorage.setItem('fg_user',  JSON.stringify(data.user));
    return data;
  },

  // Pass Google ID token from @react-oauth/google or similar lib
  googleLogin: async (idToken) => {
    const { data } = await api.post('/auth/google', { idToken });
    localStorage.setItem('fg_token', data.token);
    localStorage.setItem('fg_user',  JSON.stringify(data.user));
    return data;
  },

  forgotPassword: async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  resetPassword: async (token, password) => {
    const { data } = await api.post('/auth/reset-password', { token, password });
    return data;
  },

  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },

  logout: () => {
    localStorage.removeItem('fg_token');
    localStorage.removeItem('fg_user');
    window.location.href = '/driver/login';
  },

  getCurrentUser: () => {
    const u = localStorage.getItem('fg_user');
    return u ? JSON.parse(u) : null;
  },

  isAuthenticated: () => !!localStorage.getItem('fg_token'),
};
