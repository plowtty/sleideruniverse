import { create } from 'zustand';
import { Usuario } from '@/types';
import { authService } from '@/services/auth.service';

interface AuthState {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Acciones
  setUsuario: (usuario: Usuario | null) => void;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: null,
  isAuthenticated: false,
  isLoading: true,

  setUsuario: (usuario) =>
    set({
      usuario,
      isAuthenticated: !!usuario,
      isLoading: false,
    }),

  logout: () => {
    authService.logout();
    set({
      usuario: null,
      isAuthenticated: false,
    });
  },

  initAuth: () => {
    const usuario = authService.getCurrentUser();
    set({
      usuario,
      isAuthenticated: !!usuario,
      isLoading: false,
    });
  },
}));
