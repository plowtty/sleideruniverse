// ============================================
// SERVICIO DE PRODUCTOS
// ============================================

import { prisma } from '../config/prisma';
import { Producto, IProducto } from '../models/Producto';
import { createError } from '../middlewares/error.middleware';

/**
 * Servicio que contiene la lógica de negocio para productos
 */
export class ProductoService {
  
  // ========== MÉTODOS DE CONSULTA ==========
  
  /**
   * Obtiene todos los productos con paginación
   */
  async obtenerTodos(
    page: number = 1,
    limit: number = 10,
    categoriaId?: number,
    activo?: boolean
  ) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (categoriaId) where.categoriaId = categoriaId;
    if (activo !== undefined) where.activo = activo;

    const [productos, total] = await Promise.all([
      prisma.producto.findMany({
        where,
        skip,
        take: limit,
        include: {
          categoria: {
            select: {
              id: true,
              nombre: true
            }
          }
        },
        orderBy: {
          fechaCreacion: 'desc'
        }
      }),
      prisma.producto.count({ where })
    ]);

    return {
      productos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Obtiene un producto por ID
   */
  async obtenerPorId(id: number) {
    const producto = await prisma.producto.findUnique({
      where: { id },
      include: {
        categoria: {
          select: {
            id: true,
            nombre: true,
            descripcion: true
          }
        }
      }
    });

    if (!producto) {
      throw createError('Producto no encontrado', 404);
    }

    return producto;
  }

  /**
   * Busca productos por nombre o descripción
   */
  async buscar(query: string, limit: number = 10) {
    const productos = await prisma.producto.findMany({
      where: {
        OR: [
          { nombre: { contains: query, mode: 'insensitive' } },
          { descripcion: { contains: query, mode: 'insensitive' } }
        ],
        activo: true
      },
      take: limit,
      include: {
        categoria: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });

    return productos;
  }

  /**
   * Obtiene productos por categoría
   */
  async obtenerPorCategoria(categoriaId: number, page: number = 1, limit: number = 10) {
    return this.obtenerTodos(page, limit, categoriaId, true);
  }

  /**
   * Obtiene productos destacados o más vendidos
   */
  async obtenerDestacados(limit: number = 10) {
    const productos = await prisma.producto.findMany({
      where: {
        activo: true,
        stock: { gt: 0 }
      },
      take: limit,
      include: {
        categoria: {
          select: {
            id: true,
            nombre: true
          }
        }
      },
      orderBy: {
        fechaCreacion: 'desc'
      }
    });

    return productos;
  }

  // ========== MÉTODOS DE CREACIÓN ==========

  /**
   * Crea un nuevo producto
   */
  async crear(data: IProducto) {
    // Validar que la categoría existe
    const categoria = await prisma.categoria.findUnique({
      where: { id: data.categoriaId }
    });

    if (!categoria) {
      throw createError('La categoría especificada no existe', 400);
    }

    // Crear instancia del modelo para validaciones
    const productoModel = new Producto(data);

    // Crear en la base de datos
    const producto = await prisma.producto.create({
      data: {
        nombre: productoModel.nombre,
        descripcion: productoModel.descripcion,
        precio: productoModel.precio,
        stock: productoModel.stock,
        categoriaId: productoModel.categoriaId,
        imagenUrl: productoModel.imagenUrl,
        activo: productoModel.activo
      },
      include: {
        categoria: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });

    return producto;
  }

  // ========== MÉTODOS DE ACTUALIZACIÓN ==========

  /**
   * Actualiza un producto existente
   */
  async actualizar(id: number, data: Partial<IProducto>) {
    // Verificar que el producto existe
    const productoExistente = await this.obtenerPorId(id);

    // Si se cambia la categoría, validar que existe
    if (data.categoriaId && data.categoriaId !== productoExistente.categoriaId) {
      const categoria = await prisma.categoria.findUnique({
        where: { id: data.categoriaId }
      });

      if (!categoria) {
        throw createError('La categoría especificada no existe', 400);
      }
    }

    // Actualizar producto
    const productoActualizado = await prisma.producto.update({
      where: { id },
      data: {
        ...data,
        fechaActualizacion: new Date()
      },
      include: {
        categoria: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });

    return productoActualizado;
  }

  /**
   * Actualiza el stock de un producto
   */
  async actualizarStock(id: number, cantidad: number, operacion: 'aumentar' | 'reducir') {
    const producto = await this.obtenerPorId(id);

    let nuevoStock: number;
    if (operacion === 'aumentar') {
      nuevoStock = Number(producto.stock) + cantidad;
    } else {
      nuevoStock = Number(producto.stock) - cantidad;
      if (nuevoStock < 0) {
        throw createError('Stock insuficiente', 400);
      }
    }

    return this.actualizar(id, { stock: nuevoStock });
  }

  /**
   * Activa un producto
   */
  async activar(id: number) {
    return this.actualizar(id, { activo: true });
  }

  /**
   * Desactiva un producto
   */
  async desactivar(id: number) {
    return this.actualizar(id, { activo: false });
  }

  // ========== MÉTODOS DE ELIMINACIÓN ==========

  /**
   * Elimina un producto (soft delete - desactiva)
   */
  async eliminar(id: number) {
    // Verificar que el producto existe
    await this.obtenerPorId(id);

    // Desactivar en lugar de eliminar
    return this.desactivar(id);
  }

  /**
   * Elimina permanentemente un producto
   */
  async eliminarPermanente(id: number) {
    // Verificar que el producto existe
    await this.obtenerPorId(id);

    // Verificar que no esté en carritos u órdenes activas
    const enUso = await prisma.carritoItem.findFirst({
      where: { productoId: id }
    });

    if (enUso) {
      throw createError('No se puede eliminar el producto porque está en uso', 400);
    }

    // Eliminar permanentemente
    await prisma.producto.delete({
      where: { id }
    });

    return { message: 'Producto eliminado permanentemente' };
  }

  // ========== MÉTODOS DE VALIDACIÓN ==========

  /**
   * Verifica si hay stock disponible
   */
  async verificarStock(id: number, cantidad: number): Promise<boolean> {
    const producto = await this.obtenerPorId(id);
    return Number(producto.stock) >= cantidad;
  }

  /**
   * Verifica si el producto está disponible para la venta
   */
  async estaDisponible(id: number): Promise<boolean> {
    const producto = await this.obtenerPorId(id);
    return producto.activo && Number(producto.stock) > 0;
  }
}

// Exportar instancia única del servicio
export const productoService = new ProductoService();
