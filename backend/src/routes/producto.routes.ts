// ============================================
// RUTAS DE PRODUCTOS
// ============================================

import { Router } from 'express';
import { productoController } from '../Controllers/producto.controller';

const router = Router();

// ========== RUTAS DE CONSULTA ==========

// Obtener todos los productos con paginación y filtros
router.get('/', productoController.obtenerTodos);

// Buscar productos por nombre o descripción
router.get('/buscar', productoController.buscar);

// Obtener productos destacados
router.get('/destacados', productoController.obtenerDestacados);

// Obtener productos por categoría
router.get('/categoria/:categoriaId', productoController.obtenerPorCategoria);

// Verificar disponibilidad de un producto
router.get('/:id/disponible', productoController.verificarDisponibilidad);

// Obtener un producto por ID
router.get('/:id', productoController.obtenerPorId);

// ========== RUTAS DE CREACIÓN ==========

// Crear un nuevo producto
router.post('/', productoController.crear);

// ========== RUTAS DE ACTUALIZACIÓN ==========

// Actualizar un producto
router.put('/:id', productoController.actualizar);

// Actualizar stock de un producto
router.patch('/:id/stock', productoController.actualizarStock);

// Activar un producto
router.patch('/:id/activar', productoController.activar);

// Desactivar un producto
router.patch('/:id/desactivar', productoController.desactivar);

// ========== RUTAS DE ELIMINACIÓN ==========

// Eliminar un producto (soft delete)
router.delete('/:id', productoController.eliminar);

export default router;
