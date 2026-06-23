// components/services.js
export const API_BASE = 'http://localhost/backend-api/public';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: 'application/json',
  },
});

export function forceLogout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('api_token');
  localStorage.removeItem('user');
  delete api.defaults.headers.common.Authorization;
  alert('Sesi telah habis, silakan login kembali.');
  window.location.hash = '#/login';
}

// Request interceptor – inject Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('api_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      forceLogout();
    }
    return Promise.reject(error);
  }
);