// ============================================
// CONTROLADOR DE PRODUCTOS
// ============================================

import { Request, Response, NextFunction } from 'express';
import { productoService } from '../services/producto.service';
import { asyncHandler } from '../middlewares/error.middleware';

/**
 * Controlador que maneja las peticiones HTTP relacionadas con productos
 */
export class ProductoController {

  // ========== MÉTODOS DE CONSULTA ==========

  /**
   * GET /api/productos
   * Obtiene todos los productos con paginación y filtros
   */
  obtenerTodos = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const categoriaId = req.query.categoriaId ? parseInt(req.query.categoriaId as string) : undefined;
    const activo = req.query.activo === 'true' ? true : req.query.activo === 'false' ? false : undefined;

    const resultado = await productoService.obtenerTodos(page, limit, categoriaId, activo);

    res.status(200).json({
      success: true,
      data: resultado.productos,
      pagination: resultado.pagination
    });
  });

  /**
   * GET /api/productos/:id
   * Obtiene un producto por su ID
   */
  obtenerPorId = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const producto = await productoService.obtenerPorId(id);

    res.status(200).json({
      success: true,
      data: producto
    });
  });

  /**
   * GET /api/productos/buscar?q=query
   * Busca productos por nombre o descripción
   */
  buscar = asyncHandler(async (req: Request, res: Response) => {
    const query = req.query.q as string;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!query) {
      res.status(400).json({
        success: false,
        message: 'El parámetro de búsqueda "q" es requerido'
      });
      return;
    }

    const productos = await productoService.buscar(query, limit);

    res.status(200).json({
      success: true,
      data: productos,
      count: productos.length
    });
  });

  /**
   * GET /api/productos/categoria/:categoriaId
   * Obtiene productos por categoría
   */
  obtenerPorCategoria = asyncHandler(async (req: Request, res: Response) => {
    const categoriaId = parseInt(req.params.categoriaId);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const resultado = await productoService.obtenerPorCategoria(categoriaId, page, limit);

    res.status(200).json({
      success: true,
      data: resultado.productos,
      pagination: resultado.pagination
    });
  });

  /**
   * GET /api/productos/destacados
   * Obtiene productos destacados
   */
  obtenerDestacados = asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 10;
    const productos = await productoService.obtenerDestacados(limit);

    res.status(200).json({
      success: true,
      data: productos,
      count: productos.length
    });
  });

  // ========== MÉTODOS DE CREACIÓN ==========

  /**
   * POST /api/productos
   * Crea un nuevo producto
   */
  crear = asyncHandler(async (req: Request, res: Response) => {
    const producto = await productoService.crear(req.body);

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: producto
    });
  });

  // ========== MÉTODOS DE ACTUALIZACIÓN ==========

  /**
   * PUT /api/productos/:id
   * Actualiza un producto existente
   */
  actualizar = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const producto = await productoService.actualizar(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: producto
    });
  });

  /**
   * PATCH /api/productos/:id/stock
   * Actualiza el stock de un producto
   */
  actualizarStock = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { cantidad, operacion } = req.body;

    if (!cantidad || !operacion) {
      res.status(400).json({
        success: false,
        message: 'Los campos cantidad y operacion son requeridos'
      });
      return;
    }

    if (operacion !== 'aumentar' && operacion !== 'reducir') {
      res.status(400).json({
        success: false,
        message: 'La operación debe ser "aumentar" o "reducir"'
      });
      return;
    }

    const producto = await productoService.actualizarStock(id, cantidad, operacion);

    res.status(200).json({
      success: true,
      message: `Stock ${operacion === 'aumentar' ? 'aumentado' : 'reducido'} exitosamente`,
      data: producto
    });
  });

  /**
   * PATCH /api/productos/:id/activar
   * Activa un producto
   */
  activar = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const producto = await productoService.activar(id);

    res.status(200).json({
      success: true,
      message: 'Producto activado exitosamente',
      data: producto
    });
  });

  /**
   * PATCH /api/productos/:id/desactivar
   * Desactiva un producto
   */
  desactivar = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const producto = await productoService.desactivar(id);

    res.status(200).json({
      success: true,
      message: 'Producto desactivado exitosamente',
      data: producto
    });
  });

  // ========== MÉTODOS DE ELIMINACIÓN ==========

  /**
   * DELETE /api/productos/:id
   * Elimina un producto (soft delete)
   */
  eliminar = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const producto = await productoService.eliminar(id);

    res.status(200).json({
      success: true,
      message: 'Producto eliminado exitosamente',
      data: producto
    });
  });

  // ========== MÉTODOS DE VALIDACIÓN ==========

  /**
   * GET /api/productos/:id/disponible
   * Verifica si un producto está disponible
   */
  verificarDisponibilidad = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const disponible = await productoService.estaDisponible(id);

    res.status(200).json({
      success: true,
      disponible
    });
  });
}

// Exportar instancia única del controlador
export const productoController = new ProductoController();
