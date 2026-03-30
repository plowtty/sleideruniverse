// ============================================
// TIPOS PRINCIPALES
// ============================================

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'admin' | 'cliente' | 'vendedor';
  telefono?: string;
  direccion?: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  imagenUrl?: string;
  activo: boolean;
  orden: number;
  fechaCreacion: string;
  fechaActualizacion: string;
  _count?: {
    productos: number;
  };
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: string;
  stock: number;
  categoriaId: number;
  imagenUrl?: string;
  activo: boolean;
  fechaCreacion: string;
  fechaActualizacion: string;
  categoria?: {
    id: number;
    nombre: string;
  };
}

export interface CarritoItem {
  id: number;
  productoId: number;
  cantidad: number;
  precio: string;
  producto?: Producto;
}

export interface Carrito {
  id: number;
  usuarioId: number;
  items: CarritoItem[];
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface OrdenItem {
  id: number;
  ordenId: number;
  productoId: number;
  cantidad: number;
  precio?: string;
  precioUnitario?: string;
  subtotal?: string;
  producto?: Producto;
}

export type EstadoOrden = 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado';

export interface Orden {
  id: number;
  usuarioId: number;
  estado: EstadoOrden;
  total: string;
  direccionEnvio: string;
  metodoPago?: string;
  notas?: string;
  items: OrdenItem[];
  fechaCreacion: string;
  fechaActualizacion: string;
  usuario?: Usuario;
}

// ============================================
// TIPOS DE API
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  telefono?: string;
  direccion?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    usuario: Usuario;
    token: string;
  };
}
