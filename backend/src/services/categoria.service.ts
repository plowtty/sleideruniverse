// ============================================
// SERVICIO DE CATEGORÍAS
// ============================================

import { prisma } from '../config/prisma';
import { Categoria, ICategoria } from '../models/Categoria';
import { createError } from '../middlewares/error.middleware';

/**
 * Servicio que contiene la lógica de negocio para categorías
 */
export class CategoriaService {

  // ========== MÉTODOS DE CONSULTA ==========

  /**
   * Obtiene todas las categorías
   */
  async obtenerTodas(activo?: boolean) {
    const where: any = {};
    if (activo !== undefined) where.activo = activo;

    const categorias = await prisma.categoria.findMany({
      where,
      orderBy: {
        orden: 'asc'
      },
      include: {
        _count: {
          select: {
            productos: true
          }
        }
      }
    });

    return categorias;
  }

  /**
   * Obtiene una categoría por ID
   */
  async obtenerPorId(id: number) {
    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            productos: true
          }
        }
      }
    });

    if (!categoria) {
      throw createError('Categoría no encontrada', 404);
    }

    return categoria;
  }

  /**
   * Obtiene una categoría con sus productos
   */
  async obtenerConProductos(id: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: {
        productos: {
          where: {
            activo: true
          },
          skip,
          take: limit,
          orderBy: {
            fechaCreacion: 'desc'
          }
        },
        _count: {
          select: {
            productos: true
          }
        }
      }
    });

    if (!categoria) {
      throw createError('Categoría no encontrada', 404);
    }

    return {
      categoria,
      pagination: {
        page,
        limit,
        total: categoria._count.productos,
        totalPages: Math.ceil(categoria._count.productos / limit)
      }
    };
  }

  /**
   * Obtiene categorías activas con productos disponibles
   */
  async obtenerActivas() {
    return this.obtenerTodas(true);
  }

  // ========== MÉTODOS DE CREACIÓN ==========

  /**
   * Crea una nueva categoría
   */
  async crear(data: ICategoria) {
    // Crear instancia del modelo para validaciones
    const categoriaModel = new Categoria(data);

    // Obtener el último orden para asignar uno nuevo
    const ultimaCategoria = await prisma.categoria.findFirst({
      orderBy: {
        orden: 'desc'
      }
    });

    const nuevoOrden = categoriaModel.orden ?? (ultimaCategoria ? ultimaCategoria.orden + 1 : 0);

    // Crear en la base de datos
    const categoria = await prisma.categoria.create({
      data: {
        nombre: categoriaModel.nombre,
        descripcion: categoriaModel.descripcion,
        imagenUrl: categoriaModel.imagenUrl,
        activo: categoriaModel.activo,
        orden: nuevoOrden
      }
    });

    return categoria;
  }

  // ========== MÉTODOS DE ACTUALIZACIÓN ==========

  /**
   * Actualiza una categoría existente
   */
  async actualizar(id: number, data: Partial<ICategoria>) {
    // Verificar que la categoría existe
    await this.obtenerPorId(id);

    // Actualizar categoría
    const categoriaActualizada = await prisma.categoria.update({
      where: { id },
      data: {
        ...data,
        fechaActualizacion: new Date()
      }
    });

    return categoriaActualizada;
  }

  /**
   * Actualiza el orden de una categoría
   */
  async actualizarOrden(id: number, nuevoOrden: number) {
    if (nuevoOrden < 0) {
      throw createError('El orden no puede ser negativo', 400);
    }

    return this.actualizar(id, { orden: nuevoOrden });
  }

  /**
   * Reordena categorías - intercambia posiciones
   */
  async reordenar(id1: number, id2: number) {
    const [cat1, cat2] = await Promise.all([
      this.obtenerPorId(id1),
      this.obtenerPorId(id2)
    ]);

    // Intercambiar órdenes
    await Promise.all([
      this.actualizar(id1, { orden: cat2.orden }),
      this.actualizar(id2, { orden: cat1.orden })
    ]);

    return {
      message: 'Categorías reordenadas exitosamente'
    };
  }

  /**
   * Activa una categoría
   */
  async activar(id: number) {
    return this.actualizar(id, { activo: true });
  }

  /**
   * Desactiva una categoría
   */
  async desactivar(id: number) {
    return this.actualizar(id, { activo: false });
  }

  // ========== MÉTODOS DE ELIMINACIÓN ==========

  /**
   * Elimina una categoría (soft delete - desactiva)
   */
  async eliminar(id: number) {
    // Verificar que la categoría existe
    await this.obtenerPorId(id);

    // Verificar si tiene productos asociados
    const productosCount = await prisma.producto.count({
      where: { categoriaId: id }
    });

    if (productosCount > 0) {
      throw createError(
        `No se puede eliminar la categoría porque tiene ${productosCount} producto(s) asociado(s)`,
        400
      );
    }

    // Desactivar en lugar de eliminar
    return this.desactivar(id);
  }

  /**
   * Elimina permanentemente una categoría
   */
  async eliminarPermanente(id: number) {
    // Verificar que la categoría existe
    await this.obtenerPorId(id);

    // Verificar que no tenga productos
    const productosCount = await prisma.producto.count({
      where: { categoriaId: id }
    });

    if (productosCount > 0) {
      throw createError(
        `No se puede eliminar la categoría porque tiene ${productosCount} producto(s) asociado(s)`,
        400
      );
    }

    // Eliminar permanentemente
    await prisma.categoria.delete({
      where: { id }
    });

    return { message: 'Categoría eliminada permanentemente' };
  }

  // ========== MÉTODOS DE VALIDACIÓN ==========

  /**
   * Verifica si una categoría está activa
   */
  async estaActiva(id: number): Promise<boolean> {
    const categoria = await this.obtenerPorId(id);
    return categoria.activo;
  }

  /**
   * Cuenta productos en una categoría
   */
  async contarProductos(id: number): Promise<number> {
    const categoria = await this.obtenerPorId(id);
    return categoria._count.productos;
  }
}

// Exportar instancia única del servicio
export const categoriaService = new CategoriaService();
