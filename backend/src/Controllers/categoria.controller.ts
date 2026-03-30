// ============================================
// CONTROLADOR DE CATEGORÍAS
// ============================================

import { Request, Response } from 'express';
import { categoriaService } from '../services/categoria.service';
import { asyncHandler } from '../middlewares/error.middleware';

/**
 * Controlador que maneja las peticiones HTTP relacionadas con categorías
 */
export class CategoriaController {

  // ========== MÉTODOS DE CONSULTA ==========

  /**
   * GET /api/categorias
   * Obtiene todas las categorías
   */
  obtenerTodas = asyncHandler(async (req: Request, res: Response) => {
    const activo = req.query.activo === 'true' ? true : req.query.activo === 'false' ? false : undefined;
    const categorias = await categoriaService.obtenerTodas(activo);

    res.status(200).json({
      success: true,
      data: categorias,
      count: categorias.length
    });
  });

  /**
   * GET /api/categorias/:id
   * Obtiene una categoría por su ID
   */
  obtenerPorId = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const categoria = await categoriaService.obtenerPorId(id);

    res.status(200).json({
      success: true,
      data: categoria
    });
  });

  /**
   * GET /api/categorias/:id/productos
   * Obtiene una categoría con sus productos
   */
  obtenerConProductos = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const resultado = await categoriaService.obtenerConProductos(id, page, limit);

    res.status(200).json({
      success: true,
      data: resultado.categoria,
      pagination: resultado.pagination
    });
  });

  /**
   * GET /api/categorias/activas
   * Obtiene solo las categorías activas
   */
  obtenerActivas = asyncHandler(async (req: Request, res: Response) => {
    const categorias = await categoriaService.obtenerActivas();

    res.status(200).json({
      success: true,
      data: categorias,
      count: categorias.length
    });
  });

  // ========== MÉTODOS DE CREACIÓN ==========

  /**
   * POST /api/categorias
   * Crea una nueva categoría
   */
  crear = asyncHandler(async (req: Request, res: Response) => {
    const categoria = await categoriaService.crear(req.body);

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: categoria
    });
  });

  // ========== MÉTODOS DE ACTUALIZACIÓN ==========

  /**
   * PUT /api/categorias/:id
   * Actualiza una categoría existente
   */
  actualizar = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const categoria = await categoriaService.actualizar(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: categoria
    });
  });

  /**
   * PATCH /api/categorias/:id/orden
   * Actualiza el orden de una categoría
   */
  actualizarOrden = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { orden } = req.body;

    if (orden === undefined || orden === null) {
      res.status(400).json({
        success: false,
        message: 'El campo orden es requerido'
      });
      return;
    }

    const categoria = await categoriaService.actualizarOrden(id, orden);

    res.status(200).json({
      success: true,
      message: 'Orden actualizado exitosamente',
      data: categoria
    });
  });

  /**
   * PATCH /api/categorias/reordenar
   * Reordena dos categorías intercambiando posiciones
   */
  reordenar = asyncHandler(async (req: Request, res: Response) => {
    const { id1, id2 } = req.body;

    if (!id1 || !id2) {
      res.status(400).json({
        success: false,
        message: 'Se requieren id1 e id2 para reordenar'
      });
      return;
    }

    const resultado = await categoriaService.reordenar(id1, id2);

    res.status(200).json({
      success: true,
      message: resultado.message
    });
  });

  /**
   * PATCH /api/categorias/:id/activar
   * Activa una categoría
   */
  activar = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const categoria = await categoriaService.activar(id);

    res.status(200).json({
      success: true,
      message: 'Categoría activada exitosamente',
      data: categoria
    });
  });

  /**
   * PATCH /api/categorias/:id/desactivar
   * Desactiva una categoría
   */
  desactivar = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const categoria = await categoriaService.desactivar(id);

    res.status(200).json({
      success: true,
      message: 'Categoría desactivada exitosamente',
      data: categoria
    });
  });

  // ========== MÉTODOS DE ELIMINACIÓN ==========

  /**
   * DELETE /api/categorias/:id
   * Elimina una categoría (soft delete)
   */
  eliminar = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const categoria = await categoriaService.eliminar(id);

    res.status(200).json({
      success: true,
      message: 'Categoría eliminada exitosamente',
      data: categoria
    });
  });

  // ========== MÉTODOS DE ESTADÍSTICAS ==========

  /**
   * GET /api/categorias/:id/productos/count
   * Cuenta los productos de una categoría
   */
  contarProductos = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const count = await categoriaService.contarProductos(id);

    res.status(200).json({
      success: true,
      categoriaId: id,
      productosCount: count
    });
  });
}

// Exportar instancia única del controlador
export const categoriaController = new CategoriaController();
