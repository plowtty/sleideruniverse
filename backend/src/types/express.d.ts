// ============================================
// EXTENSIONES DE TIPOS PARA EXPRESS
// ============================================

import { Request } from 'express';

// Extender la interfaz Request de Express para incluir el usuario autenticado
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        rol: string;
      };
    }
  }
}

export {};
