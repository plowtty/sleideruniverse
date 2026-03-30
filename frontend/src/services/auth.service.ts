import apiClient from './api';
import { AuthResponse, LoginCredentials, RegisterData, Usuario } from '@/types';

export const authService = {
  // Iniciar sesión
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.data.usuario));
    }
    return response.data;
  },

  // Registrar nuevo usuario
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.data.usuario));
    }
    return response.data;
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },

  // Obtener usuario actual
  getCurrentUser: (): Usuario | null => {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  },

  // Verificar si está autenticado
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};
