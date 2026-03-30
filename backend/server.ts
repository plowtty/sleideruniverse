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

    // Manejo de cierre graceful
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
