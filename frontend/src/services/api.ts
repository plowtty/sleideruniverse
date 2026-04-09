import axios from 'axios';

// `VITE_API_URL` puede venir con o sin `/api`. Aquí se normaliza
// para evitar errores de configuración entre local y producción.
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/$/, '')}/api`;

/**
 * Cliente HTTP centralizado para toda la app.
 * Cualquier servicio (`auth.service`, `product.service`, etc.) usa esta instancia.
 */
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request:
// inyecta automáticamente el JWT si existe en localStorage.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response:
// si el backend responde 401, se limpia sesión local y se redirige a login.
// Esto evita estados inconsistentes cuando el token expira o es inválido.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
