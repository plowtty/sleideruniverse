// ============================================
// RUTAS DE USUARIOS
// ============================================

import { Router } from 'express';

const router = Router();

// TODO: Implementar controladores de usuarios
// Rutas pendientes:
// GET    /api/usuarios          - Obtener todos los usuarios
// GET    /api/usuarios/:id      - Obtener un usuario por ID
// PUT    /api/usuarios/:id      - Actualizar un usuario
// DELETE /api/usuarios/:id      - Eliminar un usuario

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Ruta de usuarios - En desarrollo'
  });
});

export default router;
