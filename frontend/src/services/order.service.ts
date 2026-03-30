import apiClient from './api';
import { Orden } from '@/types';

interface CrearOrdenItemPayload {
  productoId: number;
  cantidad: number;
}

interface CrearOrdenPayload {
  direccionEnvio: string;
  metodoPago: string;
  notas?: string;
  items: CrearOrdenItemPayload[];
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const orderService = {
  crear: async (payload: CrearOrdenPayload): Promise<Orden> => {
    const response = await apiClient.post<ApiResponse<Orden>>('/ordenes', payload);
    return response.data.data;
  },

  obtenerMisOrdenes: async (): Promise<Orden[]> => {
    const response = await apiClient.get<ApiResponse<Orden[]>>('/ordenes/mis');
    return response.data.data;
  },
};
