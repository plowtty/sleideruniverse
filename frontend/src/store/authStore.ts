import { create } from 'zustand';
import { Usuario } from '@/types';
import { authService } from '@/services/auth.service';

/**
 * Store global de autenticación.
 * Fuente única de verdad para usuario logueado y estado de sesión en frontend.
 */
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
  // Estado inicial antes de leer sesión persistida.
  usuario: null,
  isAuthenticated: false,
  isLoading: true,

  // Se usa después de login/register para persistir usuario en memoria.
  setUsuario: (usuario) =>
    set({
      usuario,
      isAuthenticated: !!usuario,
      isLoading: false,
    }),

  // Cierra sesión en backend/storage y limpia estado global.
  logout: () => {
    authService.logout();
    set({
      usuario: null,
      isAuthenticated: false,
    });
  },

  // Hidrata estado al cargar la app leyendo usuario guardado localmente.
  initAuth: () => {
    const usuario = authService.getCurrentUser();
    set({
      usuario,
      isAuthenticated: !!usuario,
      isLoading: false,
    });
  },
}));
