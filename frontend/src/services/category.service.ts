import apiClient from './api';
import { Categoria } from '@/types';

export const categoryService = {
  // Obtener todas las categorías
  getAll: async (activas?: boolean) => {
    const params = activas ? '?activas=true' : '';
    const response = await apiClient.get<{ success: boolean; data: Categoria[] }>(`/categorias${params}`);
    return response.data.data;
  },

  // Obtener una categoría por ID
  getById: async (id: number) => {
    const response = await apiClient.get<{ success: boolean; data: Categoria }>(`/categorias/${id}`);
    return response.data.data;
  },

  // Obtener categoría con sus productos
  getWithProducts: async (id: number) => {
    const response = await apiClient.get<{ success: boolean; data: Categoria }>(`/categorias/${id}/productos`);
    return response.data.data;
  },

  // Crear nueva categoría
  create: async (categoria: Partial<Categoria>) => {
    const response = await apiClient.post<{ success: boolean; data: Categoria }>('/categorias', categoria);
    return response.data.data;
  },

  // Actualizar categoría
  update: async (id: number, categoria: Partial<Categoria>) => {
    const response = await apiClient.put<{ success: boolean; data: Categoria }>(`/categorias/${id}`, categoria);
    return response.data.data;
  },

  // Eliminar categoría
  delete: async (id: number) => {
    await apiClient.delete(`/categorias/${id}`);
  },
};
