import apiClient from './api';
import { Producto, PaginatedResponse } from '@/types';

export const productService = {
  // Obtener todos los productos con paginación
  getAll: async (page = 1, limit = 10, busqueda?: string, categoriaId?: number) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (busqueda) params.append('busqueda', busqueda);
    if (categoriaId) params.append('categoriaId', categoriaId.toString());

    const response = await apiClient.get<PaginatedResponse<Producto>>(`/productos?${params}`);
    return response.data;
  },

  // Obtener un producto por ID
  getById: async (id: number) => {
    const response = await apiClient.get<{ success: boolean; data: Producto }>(`/productos/${id}`);
    return response.data.data;
  },

  // Crear nuevo producto
  create: async (producto: Partial<Producto>) => {
    const response = await apiClient.post<{ success: boolean; data: Producto }>('/productos', producto);
    return response.data.data;
  },

  // Actualizar producto
  update: async (id: number, producto: Partial<Producto>) => {
    const response = await apiClient.put<{ success: boolean; data: Producto }>(`/productos/${id}`, producto);
    return response.data.data;
  },

  // Eliminar producto
  delete: async (id: number) => {
    await apiClient.delete(`/productos/${id}`);
  },

  // Buscar productos
  search: async (busqueda: string) => {
    const response = await apiClient.get<PaginatedResponse<Producto>>(`/productos?busqueda=${busqueda}`);
    return response.data;
  },
};
