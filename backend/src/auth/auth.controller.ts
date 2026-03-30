// ============================================
// CONTROLADOR DE AUTENTICACIÓN
// ============================================

import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';

/**
 * POST /api/auth/register
 * Registrar nuevo usuario
 */
export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { nombre, apellido, email, password, telefono, direccion } = req.body;

    // Validaciones básicas
    if (!nombre || !apellido || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Nombre, apellido, email y password son requeridos'
      });
      return;
    }

    if (password.length < 4) {
      res.status(400).json({
        success: false,
        message: 'El password debe tener al menos 4 caracteres'
      });
      return;
    }

    const result = await authService.registerUser({
      nombre,
      apellido,
      email,
      password,
      telefono,
      direccion
    });

    res.status(201).json({
      success: true,
      data: result,
      message: 'Usuario registrado exitosamente'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/login
 * Iniciar sesión
 */
export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;

    // Validaciones básicas
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email y password son requeridos'
      });
      return;
    }

    const result = await authService.loginUser({ email, password });

    res.json({
      success: true,
      data: result,
      message: 'Login exitoso'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/auth/me
 * Obtener perfil del usuario autenticado
 */
export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
      return;
    }

    const usuario = await authService.verifyToken(token);

    res.json({
      success: true,
      data: usuario
    });
  } catch (error) {
    next(error);
  }
}
