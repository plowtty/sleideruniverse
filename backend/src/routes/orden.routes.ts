// ============================================
// RUTAS DE ÓRDENES
// ============================================

import { Router } from 'express';
import { ordenController } from '../Controllers/orden.controller';

const router = Router();

// Obtener todas las órdenes
router.get('/', ordenController.obtenerTodas);

// Obtener órdenes del usuario autenticado
router.get('/mis', ordenController.obtenerMisOrdenes);

// Obtener una orden por ID
router.get('/:id', ordenController.obtenerPorId);

// Crear una nueva orden
router.post('/', ordenController.crear);

// Cancelar una orden
router.patch('/:id/cancelar', ordenController.cancelar);

export default router;
