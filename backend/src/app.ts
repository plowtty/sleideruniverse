// ============================================
// CONFIGURACIÓN DE LA APLICACIÓN EXPRESS
// ============================================

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env';

// Importar rutas
import productoRoutes from './routes/producto.routes';
import categoriaRoutes from './routes/categoria.routes';
import usuarioRoutes from './routes/usuario.routes';
import ordenRoutes from './routes/orden.routes';
import authRoutes from './auth/auth.routes';

// Importar middlewares
import { errorHandler } from './middlewares/error.middleware';
import { requestLogger } from './middlewares/logger.middleware';

// ============================================
// INICIALIZAR APLICACIÓN
// ============================================

const app: Application = express();

// ============================================
// MIDDLEWARES GLOBALES
// ============================================

// CORS - Permitir peticiones desde el frontend
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser - Parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan - Logger de peticiones HTTP
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Logger personalizado
app.use(requestLogger);

// ============================================
// RUTAS DE SALUD
// ============================================

app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: '🚀 API de Sleider Universe funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Servidor en funcionamiento',
    uptime: process.uptime(),
    environment: env.NODE_ENV
  });
});

app.get('/kaithhealthcheck', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Healthcheck OK',
    uptime: process.uptime(),
    environment: env.NODE_ENV
  });
});

app.get('/kaithheathcheck', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Healthcheck OK',
    uptime: process.uptime(),
    environment: env.NODE_ENV
  });
});

// ============================================
// RUTAS DE LA API
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/ordenes', ordenRoutes);

// ============================================
// MANEJO DE RUTAS NO ENCONTRADAS
// ============================================

app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`,
    timestamp: new Date().toISOString()
  });
});

// ============================================
// MIDDLEWARE DE MANEJO DE ERRORES
// ============================================

app.use(errorHandler);

// ============================================
// EXPORTAR APLICACIÓN
// ============================================

export default app;
