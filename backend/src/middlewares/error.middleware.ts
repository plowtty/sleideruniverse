// ============================================
// MIDDLEWARE DE MANEJO DE ERRORES
// ============================================

import { Request, Response, NextFunction } from 'express';
import { isDevelopment } from '../config/env';

/**
 * Interfaz para errores personalizados
 */
export interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

/**
 * Middleware global para manejo de errores
 * Captura todos los errores de la aplicación y los formatea.
 * Estrategia:
 * - Desarrollo: máxima visibilidad (stack + detalle)
 * - Producción: mensajes seguros, sin filtrar internals
 */
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Establecer código de estado por defecto
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log del error en desarrollo
  if (isDevelopment()) {
    console.error('');
    console.error('=================================================');
    console.error('❌ ERROR CAPTURADO');
    console.error('=================================================');
    console.error('Mensaje:', err.message);
    console.error('Status Code:', err.statusCode);
    console.error('Stack:', err.stack);
    console.error('=================================================');
    console.error('');
  }

  // Respuesta en desarrollo (incluye stack trace para depuración)
  if (isDevelopment()) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err
    });
    return;
  }

  // Respuesta en producción (oculta detalles sensibles)
  if (err.isOperational) {
    // Error operacional: viene de validaciones/reglas esperadas.
    // Se puede devolver al cliente con su mensaje original.
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message
    });
  } else {
    // Error de programación: bug inesperado.
    // Se registra internamente y se responde mensaje genérico.
    console.error('ERROR DE PROGRAMACIÓN:', err);
    res.status(500).json({
      success: false,
      status: 'error',
      message: 'Algo salió mal en el servidor'
    });
  }
}

/**
 * Crea un error operacional personalizado
 * Útil para servicios/controladores cuando se quiere abortar flujo
 * con código HTTP y mensaje controlado.
 */
export function createError(message: string, statusCode: number = 500): AppError {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
  error.isOperational = true;
  return error;
}

/**
 * Manejo de errores asíncronos
 * Wrapper para evitar try-catch repetitivo en cada controlador.
 * Cualquier rechazo se reenvía al middleware global de errores.
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
