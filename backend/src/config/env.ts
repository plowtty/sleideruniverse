// ============================================
// CONFIGURACIÓN DE VARIABLES DE ENTORNO
// ============================================

import dotenv from 'dotenv';

// Cargar variables de entorno desde archivo .env
dotenv.config();

/**
 * Interfaz que define todas las variables de entorno necesarias
 */
interface EnvConfig {
  // Servidor
  PORT: number;
  NODE_ENV: string;
  
  // Base de datos
  DATABASE_URL: string;
  
  // JWT
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  
  // CORS
  FRONTEND_URL: string;
}

/**
 * Valida que todas las variables de entorno requeridas estén definidas
 */
function validateEnv(): void {
  const required = [
    'DATABASE_URL',
    'JWT_SECRET'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Faltan las siguientes variables de entorno: ${missing.join(', ')}`
    );
  }
}

// Validar variables de entorno al cargar el módulo
validateEnv();

/**
 * Objeto de configuración exportado con valores por defecto
 */
export const env: EnvConfig = {
  // Configuración del servidor
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Configuración de base de datos
  DATABASE_URL: process.env.DATABASE_URL!,
  
  // Configuración de JWT
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // Configuración de CORS
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173'
};

/**
 * Verifica si el entorno es de producción
 */
export const isProduction = (): boolean => {
  return env.NODE_ENV === 'production';
};

/**
 * Verifica si el entorno es de desarrollo
 */
export const isDevelopment = (): boolean => {
  return env.NODE_ENV === 'development';
};
