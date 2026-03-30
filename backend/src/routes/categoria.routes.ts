// ============================================
// RUTAS DE CATEGORÍAS
// ============================================

import { Router } from 'express';
import { categoriaController } from '../Controllers/categoria.controller';

const router = Router();

// ========== RUTAS DE CONSULTA ==========

// Obtener todas las categorías
router.get('/', categoriaController.obtenerTodas);

// Obtener solo categorías activas
router.get('/activas', categoriaController.obtenerActivas);

// Contar productos de una categoría
router.get('/:id/productos/count', categoriaController.contarProductos);

// Obtener una categoría con sus productos
router.get('/:id/productos', categoriaController.obtenerConProductos);

// Obtener una categoría por ID
router.get('/:id', categoriaController.obtenerPorId);

// ========== RUTAS DE CREACIÓN ==========

// Crear una nueva categoría
router.post('/', categoriaController.crear);

// ========== RUTAS DE ACTUALIZACIÓN ==========

// Actualizar una categoría
router.put('/:id', categoriaController.actualizar);

// Reordenar categorías
router.patch('/reordenar', categoriaController.reordenar);

// Actualizar orden de una categoría
router.patch('/:id/orden', categoriaController.actualizarOrden);

// Activar una categoría
router.patch('/:id/activar', categoriaController.activar);

// Desactivar una categoría
router.patch('/:id/desactivar', categoriaController.desactivar);

// ========== RUTAS DE ELIMINACIÓN ==========

// Eliminar una categoría (soft delete)
router.delete('/:id', categoriaController.eliminar);

export default router;
