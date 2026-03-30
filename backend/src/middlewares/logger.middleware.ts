// ============================================
// MIDDLEWARE DE LOGGING DE PETICIONES
// ============================================

import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para registrar información de cada petición HTTP
 */
export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startTime = Date.now();

  // Capturar cuando la respuesta finaliza
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { method, originalUrl } = req;
    const { statusCode } = res;

    // Determinar color según status code
    let statusColor = '';
    if (statusCode >= 500) statusColor = '🔴'; // Error del servidor
    else if (statusCode >= 400) statusColor = '🟡'; // Error del cliente
    else if (statusCode >= 300) statusColor = '🔵'; // Redirección
    else if (statusCode >= 200) statusColor = '🟢'; // Éxito

    // Log formateado
    console.log(
      `${statusColor} ${method} ${originalUrl} - ${statusCode} - ${duration}ms`
    );
  });

  next();
}

/**
 * Middleware para registrar información del usuario autenticado
 */
export function userLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.user) {
    console.log(`👤 Usuario autenticado: ${req.user.id} - ${req.user.email}`);
  }
  next();
}
