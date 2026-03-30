// ============================================
// RUTAS DE AUTENTICACIÓN
// ============================================

import { Router } from 'express';
import * as authController from './auth.controller';

const router = Router();

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', authController.register);

// POST /api/auth/login - Iniciar sesión
router.post('/login', authController.login);

// GET /api/auth/me - Obtener perfil del usuario autenticado
router.get('/me', authController.getProfile);

export default router;
