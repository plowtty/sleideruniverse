// ============================================
// SERVIDOR PRINCIPAL
// ============================================

import app from './src/app';
import { env } from './src/config/env';
import { connectDatabase } from './src/config/prisma';

// ============================================
// INICIAR SERVIDOR
// ============================================

/**
 * Función principal para iniciar el servidor
 * Orden de arranque:
 * 1) Validar/cargar entorno (se hace al importar `env`)
 * 2) Conectar base de datos
 * 3) Levantar servidor HTTP
 * 4) Registrar señales para apagado controlado
 */
async function startServer(): Promise<void> {
  try {
    // Conectar a la base de datos
    await connectDatabase();

    // Iniciar servidor Express
    const server = app.listen(env.PORT, () => {
      console.log('');
      console.log('=================================================');
      console.log('🚀 Servidor iniciado correctamente');
      console.log('=================================================');
      console.log(`📌 Entorno: ${env.NODE_ENV}`);
      console.log(`🌐 URL: http://localhost:${env.PORT}`);
      console.log(`🔗 API: http://localhost:${env.PORT}/api`);
      console.log(`💾 Base de datos: Conectada`);
      console.log('=================================================');
      console.log('');
    });

    // Manejo de cierre graceful:
    // permite terminar conexiones activas antes de salir del proceso.
    process.on('SIGTERM', () => {
      console.log('');
      console.log('⚠️  SIGTERM recibido: cerrando servidor...');
      server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('');
      console.log('⚠️  SIGINT recibido: cerrando servidor...');
      server.close(() => {
        console.log('✅ Servidor cerrado correctamente');
        process.exit(0);
      });
    });

  } catch (error) {
    // Si falla el arranque inicial (DB o servidor), se aborta el proceso
    // para evitar dejar la app en estado inconsistente.
    console.error('');
    console.error('=================================================');
    console.error('❌ Error al iniciar el servidor');
    console.error('=================================================');
    console.error(error);
    console.error('=================================================');
    console.error('');
    process.exit(1);
  }
}

// ============================================
// EJECUTAR SERVIDOR
// ============================================

startServer();
