// ============================================
// CONFIGURACIÓN DEL CLIENTE DE PRISMA
// ============================================

import { PrismaClient } from '@prisma/client';
import { isDevelopment } from './env';

/**
 * Instancia global del cliente de Prisma
 * Singleton para evitar múltiples conexiones en desarrollo
 */
declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * Cliente de Prisma con configuración de logging
 * En desarrollo muestra queries, en producción solo errores
 */
export const prisma = global.prisma || new PrismaClient({
  log: isDevelopment() 
    ? ['query', 'info', 'warn', 'error'] 
    : ['error']
});

// En desarrollo, guardar la instancia globalmente para hot-reload
if (isDevelopment()) {
  global.prisma = prisma;
}

/**
 * Conecta a la base de datos
 */
export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
    process.exit(1);
  }
}

/**
 * Desconecta de la base de datos
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await prisma.$disconnect();
    console.log('✅ Desconexión de la base de datos exitosa');
  } catch (error) {
    console.error('❌ Error al desconectar de la base de datos:', error);
  }
}

/**
 * Manejo de señales de terminación para cerrar conexión
 */
process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDatabase();
  process.exit(0);
});
